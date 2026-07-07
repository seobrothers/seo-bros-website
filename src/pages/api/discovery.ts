import type { APIRoute } from "astro";
import { syncContact, addToList, applyTag } from "../../lib/activecampaign";
import { clientIp, logEvent, type AnalyticsEngine } from "../../lib/eventlog";
import { verifyTurnstile } from "../../lib/turnstile";
import { rateLimit, type RateLimitKV } from "../../lib/ratelimit";
import { cfEnv } from "../../lib/cf-env";

// Free-discovery request endpoint. Used on the unlocked partner page: an agency
// (already opted in via /api/partner-lead) asks us to run a world-class free
// discovery on their own site or a client's. We tag them "free-discovery-requested"
// in ActiveCampaign and ping Slack with the URL + their notes so the team can
// run it by hand. Keeps them on the partner list 25.
//
// Runs on-demand inside the Cloudflare Worker (prerender = false).
export const prerender = false;

const AC_PARTNER_LIST_ID = 25;
const AC_DISCOVERY_TAG = "free-discovery-requested";

interface Env {
  ACTIVECAMPAIGN_API_URL?: string;
  ACTIVECAMPAIGN_API_KEY?: string;
  SLACK_PARTNER_WEBHOOK_URL?: string;
  SLACK_AUDIT_WEBHOOK_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

function readEnv(): Env {
  const e = cfEnv<Env>();
  return {
    ACTIVECAMPAIGN_API_URL: e.ACTIVECAMPAIGN_API_URL ?? import.meta.env.ACTIVECAMPAIGN_API_URL,
    ACTIVECAMPAIGN_API_KEY: e.ACTIVECAMPAIGN_API_KEY ?? import.meta.env.ACTIVECAMPAIGN_API_KEY,
    SLACK_PARTNER_WEBHOOK_URL: e.SLACK_PARTNER_WEBHOOK_URL ?? import.meta.env.SLACK_PARTNER_WEBHOOK_URL,
    SLACK_AUDIT_WEBHOOK_URL: e.SLACK_AUDIT_WEBHOOK_URL ?? import.meta.env.SLACK_AUDIT_WEBHOOK_URL,
    TURNSTILE_SECRET_KEY: e.TURNSTILE_SECRET_KEY ?? import.meta.env.TURNSTILE_SECRET_KEY,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function syncToActiveCampaign(env: Env, email: string): Promise<void> {
  const base = env.ACTIVECAMPAIGN_API_URL;
  const token = env.ACTIVECAMPAIGN_API_KEY;
  if (!base || !token) throw new Error("ActiveCampaign credentials are not configured");

  const ac = { base, token };
  const contactId = await syncContact(ac, { email });

  // Keep them on the partner list; tag them as having requested a discovery.
  // Best-effort: the request is already captured (synced + Slacked), so a
  // transient list/tag error shouldn't 500 the form.
  try {
    await addToList(ac, contactId, AC_PARTNER_LIST_ID);
  } catch (err) {
    console.error("AC partner list add failed", err);
  }
  await applyTag(ac, contactId, AC_DISCOVERY_TAG);
}

async function notifySlack(
  env: Env,
  { email, url, notes }: { email: string; url: string; notes: string }
): Promise<void> {
  const webhook = env.SLACK_PARTNER_WEBHOOK_URL ?? env.SLACK_AUDIT_WEBHOOK_URL;
  if (!webhook) return;
  const text = [
    "*Free discovery requested* :mag:",
    `*Email:* ${email}`,
    `*Site:* ${url}`,
    notes ? `*Notes:* ${notes}` : null,
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
    console.error("Slack discovery notification failed", err);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, unknown>;
  try {
    const ct = request.headers.get("content-type") ?? "";
    payload = ct.includes("application/json")
      ? ((await request.json()) as Record<string, unknown>)
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  // Honeypot: pretend success so bots don't learn.
  if (typeof payload.phoneNumber === "string" && payload.phoneNumber.trim() !== "") {
    return json({ ok: true });
  }

  // IP rate limit (no-op until the RATE_LIMIT KV binding is wired).
  const kv = cfEnv<{ RATE_LIMIT?: RateLimitKV }>().RATE_LIMIT;
  const rl = await rateLimit(kv, `discovery:${clientIp(request)}`, 20, 3600);
  if (!rl.allowed) {
    return json({ ok: false, error: "Too many requests. Please try again later." }, 429);
  }

  const email = String(payload.email ?? "").trim();
  let url = String(payload.url ?? "").trim();
  const notes = String(payload.notes ?? "").trim().slice(0, 4000);

  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: "Please enter a valid email." }, 400);
  }
  if (!url) {
    return json({ ok: false, error: "Please enter the site you'd like us to look at." }, 400);
  }
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  const env = readEnv();

  // Bot check (Turnstile). No-op until TURNSTILE_SECRET_KEY is configured.
  const turnstileOk = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY,
    payload["cf-turnstile-response"] as string | undefined,
    clientIp(request)
  );
  if (!turnstileOk) {
    return json({ ok: false, error: "Verification failed. Please try again." }, 403);
  }

  // CRM sync is best-effort: a failure here (missing creds, AC outage) must not
  // fail the discovery request. The lead is still captured via Slack + analytics
  // below, so we log and carry on rather than returning a 502.
  try {
    await syncToActiveCampaign(env, email);
  } catch (err) {
    console.error("ActiveCampaign sync failed (non-fatal)", err);
  }

  await notifySlack(env, { email, url, notes });

  const ae = cfEnv<{ AE?: AnalyticsEngine }>().AE;
  logEvent({ AE: ae }, "discovery_request", {
    ip: clientIp(request),
    domain: url,
    detail: notes ? "with-notes" : "no-notes",
  });

  return json({ ok: true });
};
