import type { APIRoute } from "astro";
import { syncContact, addToList, applyTag } from "../../lib/activecampaign";
import { clientIp, logEvent, type AnalyticsEngine } from "../../lib/eventlog";
import { verifyTurnstile } from "../../lib/turnstile";
import { rateLimit, type RateLimitKV } from "../../lib/ratelimit";

// Agency / partner soft opt-in endpoint (separate from the business audit flow
// in /api/audit). An agency gives name + email (no URL, it's not an audit) to
// unlock the partner package. They land as a LEAD in ActiveCampaign on the
// partner list; the team manually promotes the promising ones into the Portal
// later. The Portal (MSAs, account manager, billing) is prospect-level, too
// heavy for someone still at the lead stage.
//
// Runs on-demand inside the Cloudflare Worker (prerender = false).
export const prerender = false;

// Agency partner list (separate from the business audit list 24).
const AC_PARTNER_LIST_ID = 25;
const AC_PARTNER_TAG = "Partner Package Opt-In";
// "Bros Knows" monthly SEO newsletter. Only added when the optional checkbox
// is ticked — list membership + a tag for segmentation.
const AC_NEWSLETTER_LIST_ID = 26;
const AC_NEWSLETTER_TAG = "Bros Knows";

interface Env {
  ACTIVECAMPAIGN_API_URL?: string;
  ACTIVECAMPAIGN_API_KEY?: string;
  SLACK_PARTNER_WEBHOOK_URL?: string;
  SLACK_AUDIT_WEBHOOK_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

function readEnv(locals: App.Locals): Env {
  const e = (locals as { runtime?: { env?: Env } }).runtime?.env;
  return {
    ACTIVECAMPAIGN_API_URL: e?.ACTIVECAMPAIGN_API_URL ?? import.meta.env.ACTIVECAMPAIGN_API_URL,
    ACTIVECAMPAIGN_API_KEY: e?.ACTIVECAMPAIGN_API_KEY ?? import.meta.env.ACTIVECAMPAIGN_API_KEY,
    SLACK_PARTNER_WEBHOOK_URL: e?.SLACK_PARTNER_WEBHOOK_URL ?? import.meta.env.SLACK_PARTNER_WEBHOOK_URL,
    SLACK_AUDIT_WEBHOOK_URL: e?.SLACK_AUDIT_WEBHOOK_URL ?? import.meta.env.SLACK_AUDIT_WEBHOOK_URL,
    TURNSTILE_SECRET_KEY: e?.TURNSTILE_SECRET_KEY ?? import.meta.env.TURNSTILE_SECRET_KEY,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function syncToActiveCampaign(
  env: Env,
  { firstName, lastName, email, newsletter }: { firstName: string; lastName: string; email: string; newsletter: boolean }
): Promise<void> {
  const base = env.ACTIVECAMPAIGN_API_URL;
  const token = env.ACTIVECAMPAIGN_API_KEY;
  if (!base || !token) throw new Error("ActiveCampaign credentials are not configured");

  const ac = { base, token };
  const contactId = await syncContact(ac, { email, firstName, lastName });

  // List-add + tag are best-effort: the lead is already captured (synced above
  // and announced in Slack), so a transient list/tag error shouldn't 500 the
  // opt-in and push the agency to retry.
  try {
    await addToList(ac, contactId, AC_PARTNER_LIST_ID);
  } catch (err) {
    console.error("AC partner list add failed", err);
  }
  await applyTag(ac, contactId, AC_PARTNER_TAG);

  // Optional "Bros Knows" newsletter opt-in: list + tag.
  if (newsletter) {
    try {
      await addToList(ac, contactId, AC_NEWSLETTER_LIST_ID);
    } catch (err) {
      console.error("AC newsletter list add failed", err);
    }
    await applyTag(ac, contactId, AC_NEWSLETTER_TAG);
  }
}

async function notifySlack(
  env: Env,
  { name, email, agency }: { name: string; email: string; agency: string }
): Promise<void> {
  const webhook = env.SLACK_PARTNER_WEBHOOK_URL ?? env.SLACK_AUDIT_WEBHOOK_URL;
  if (!webhook) return;
  const text = [
    "*New partner package opt-in* :handshake:",
    `*Name:* ${name}`,
    `*Email:* ${email}`,
    agency ? `*Agency:* ${agency}` : null,
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
    console.error("Slack partner notification failed", err);
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
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
  const kv = (locals as { runtime?: { env?: { RATE_LIMIT?: RateLimitKV } } }).runtime?.env?.RATE_LIMIT;
  const rl = await rateLimit(kv, `partner:${clientIp(request)}`, 20, 3600);
  if (!rl.allowed) {
    return json({ ok: false, error: "Too many requests. Please try again later." }, 429);
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const agency = String(payload.agency ?? "").trim();
  // Optional newsletter checkbox: "on" from a form, true/"true" from JSON.
  const newsletter =
    payload.newsletter === "on" || payload.newsletter === true || payload.newsletter === "true";

  if (!name || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: "Please enter your name and a valid email." }, 400);
  }

  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.join(" ");

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
    await syncToActiveCampaign(env, { firstName, lastName, email, newsletter });
  } catch (err) {
    console.error("ActiveCampaign sync failed", err);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 502);
  }

  await notifySlack(env, { name, email, agency });

  const ae = (locals as { runtime?: { env?: { AE?: AnalyticsEngine } } }).runtime?.env?.AE;
  logEvent({ AE: ae }, "partner_optin", {
    ip: clientIp(request),
    detail: agency ? "with-agency" : "no-agency",
    newsletter,
  });

  return json({ ok: true });
};
