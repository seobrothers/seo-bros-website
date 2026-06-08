import type { APIRoute } from "astro";
import { syncContact, addToList, applyTag } from "../../lib/activecampaign";
import { clientIp, logEvent, type AnalyticsEngine } from "../../lib/eventlog";
import { verifyTurnstile } from "../../lib/turnstile";
import { rateLimit, type RateLimitKV } from "../../lib/ratelimit";

// Free-audit lead endpoint.
//
// Flow: AuditForm.astro POSTs { name, email, url } here -> we create/sync the
// contact in ActiveCampaign and add them to list 24 -> we post a message to a
// Slack webhook so Mike can pick the audit up manually. The Slack message
// carries the URL because the manual audit starts from there.
//
// Runs on-demand inside the Cloudflare Worker (prerender = false). Cloudflare
// secrets are read from `locals.runtime.env`; `import.meta.env` is the
// local-dev fallback (Astro loads .env.local server-side).
export const prerender = false;

const AC_LIST_ID = 24;
const AC_TAG = "Free Audit Request";
// Applied on top of the base tag when those add-on audits are requested.
const AC_TAG_LOCAL = "Discovery: Local";
const AC_TAG_AI = "Discovery: AI Citation";

interface Env {
  ACTIVECAMPAIGN_API_URL?: string;
  ACTIVECAMPAIGN_API_KEY?: string;
  SLACK_AUDIT_WEBHOOK_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

function readEnv(locals: App.Locals): Env {
  const runtimeEnv = (locals as { runtime?: { env?: Env } }).runtime?.env;
  return {
    ACTIVECAMPAIGN_API_URL:
      runtimeEnv?.ACTIVECAMPAIGN_API_URL ?? import.meta.env.ACTIVECAMPAIGN_API_URL,
    ACTIVECAMPAIGN_API_KEY:
      runtimeEnv?.ACTIVECAMPAIGN_API_KEY ?? import.meta.env.ACTIVECAMPAIGN_API_KEY,
    SLACK_AUDIT_WEBHOOK_URL:
      runtimeEnv?.SLACK_AUDIT_WEBHOOK_URL ?? import.meta.env.SLACK_AUDIT_WEBHOOK_URL,
    TURNSTILE_SECRET_KEY:
      runtimeEnv?.TURNSTILE_SECRET_KEY ?? import.meta.env.TURNSTILE_SECRET_KEY,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Normalize a user-typed site into a clean https URL, or null if unusable. */
function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes(".")) return null;
    return u.href;
  } catch {
    return null;
  }
}

/**
 * Create/update the contact in ActiveCampaign, add them to the audit list, and
 * apply the audit tag. Contact sync + list-add must succeed (they throw);
 * tagging is best-effort and never blocks the lead.
 */
async function syncToActiveCampaign(
  env: Env,
  { firstName, lastName, email, tags }: { firstName: string; lastName: string; email: string; tags: string[] }
): Promise<void> {
  const base = env.ACTIVECAMPAIGN_API_URL;
  const token = env.ACTIVECAMPAIGN_API_KEY;
  if (!base || !token) throw new Error("ActiveCampaign credentials are not configured");

  const ac = { base, token };
  const contactId = await syncContact(ac, { email, firstName, lastName });
  await addToList(ac, contactId, AC_LIST_ID);
  for (const tag of tags) await applyTag(ac, contactId, tag);
}

/** Notify Slack so Mike can run the audit. Best-effort: never throws. */
async function notifySlack(
  env: Env,
  {
    name,
    email,
    url,
    source,
    audits,
    business,
    city,
    service,
    placeId,
  }: {
    name: string;
    email: string;
    url: string;
    source: string;
    audits: string;
    business?: string;
    city?: string;
    service?: string;
    placeId?: string;
  }
): Promise<void> {
  const webhook = env.SLACK_AUDIT_WEBHOOK_URL;
  if (!webhook) return;
  const text = [
    "*New free audit request* :mag:",
    `*Name:* ${name}`,
    `*Email:* ${email}`,
    `*Website:* ${url}`,
    `*Audits:* ${audits}`,
    business ? `*Business:* ${business}${city ? `, ${city}` : ""}` : null,
    // The picker captures the exact GBP; the Maps link jumps Mike straight to it.
    placeId ? `*Google Business Profile:* https://www.google.com/maps/place/?q=place_id:${placeId}` : null,
    service ? `*Main service:* ${service}` : null,
    source ? `*From:* ${source}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("Slack audit notification failed", err);
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: Record<string, unknown>;
  try {
    const ct = request.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      payload = (await request.json()) as Record<string, unknown>;
    } else {
      payload = Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  // Honeypot: real users never fill this. Pretend success so bots don't learn.
  if (typeof payload.phoneNumber === "string" && payload.phoneNumber.trim() !== "") {
    return json({ ok: true });
  }

  // IP rate limit (no-op until the RATE_LIMIT KV binding is wired).
  const kv = (locals as { runtime?: { env?: { RATE_LIMIT?: RateLimitKV } } }).runtime?.env?.RATE_LIMIT;
  const rl = await rateLimit(kv, `audit:${clientIp(request)}`, 20, 3600);
  if (!rl.allowed) {
    return json({ ok: false, error: "Too many requests. Please try again later." }, 429);
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const url = normalizeUrl(String(payload.url ?? ""));
  const source = String(payload.source ?? "").trim();
  const business = String(payload.business ?? "").trim();
  const city = String(payload.city ?? "").trim();
  const service = String(payload.service ?? "").trim();
  const placeId = String(payload.placeId ?? "").trim();
  const wantsLocal = payload.local === "on" || payload.local === true;
  const wantsAi = payload.ai === "on" || payload.ai === true;

  if (!name || !EMAIL_RE.test(email) || !url) {
    return json(
      { ok: false, error: "Please enter your name, a valid email, and your website." },
      400
    );
  }

  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.join(" ");

  const tags = [AC_TAG];
  if (wantsLocal) tags.push(AC_TAG_LOCAL);
  if (wantsAi) tags.push(AC_TAG_AI);

  const audits = ["Site & SEO", wantsLocal && "Local", wantsAi && "AI Citation"]
    .filter(Boolean)
    .join(", ");

  const env = readEnv(locals);

  // Bot check (Turnstile). No-op until TURNSTILE_SECRET_KEY is configured.
  const turnstileOk = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY,
    payload["cf-turnstile-response"] as string | undefined,
    clientIp(request)
  );
  if (!turnstileOk) {
    return json({ ok: false, error: "Verification failed. Please try again." }, 403);
  }

  try {
    await syncToActiveCampaign(env, { firstName, lastName, email, tags });
  } catch (err) {
    console.error("ActiveCampaign sync failed", err);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 502);
  }

  // Slack is best-effort; the lead is already captured in AC by this point.
  await notifySlack(env, { name, email, url, source, audits, business, city, service, placeId });

  const ae = (locals as { runtime?: { env?: { AE?: AnalyticsEngine } } }).runtime?.env?.AE;
  logEvent({ AE: ae }, "audit_lead", {
    ip: clientIp(request),
    domain: (() => {
      try {
        return new URL(url).hostname;
      } catch {
        return "";
      }
    })(),
    detail: audits,
  });

  return json({ ok: true });
};
