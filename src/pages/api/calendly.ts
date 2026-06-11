import type { APIRoute } from "astro";
import { clientIp, logEvent, type AnalyticsEngine } from "../../lib/eventlog";

// Calendly webhook receiver. Calendly POSTs here when someone books (or cancels)
// a call on Mike's calendar; we format it and ping the sales Slack channel.
//
// Runs on-demand inside the Cloudflare Worker (prerender = false).
//
// ── SETUP (one-time, Devon) ───────────────────────────────────────────────
//  1. Slack: create an Incoming Webhook pointing at #sales-notifications and
//     set it as the Cloudflare secret SLACK_SALES_WEBHOOK_URL. (Without it we
//     fall back to the partner/audit webhook so nothing is silently lost.)
//  2. Calendly: create a Personal Access Token, then create a webhook
//     subscription so events reach this endpoint:
//        curl -X POST https://api.calendly.com/webhook_subscriptions \
//          -H "Authorization: Bearer <CALENDLY_PAT>" \
//          -H "Content-Type: application/json" \
//          -d '{
//            "url": "https://seobrothers.com/api/calendly",
//            "events": ["invitee.created", "invitee.canceled"],
//            "organization": "<your org URI>",
//            "scope": "organization",
//            "signing_key": "<a long random string>"
//          }'
//     Set that same signing_key as the Cloudflare secret
//     CALENDLY_WEBHOOK_SIGNING_KEY so we can verify requests are really from
//     Calendly. (If unset, verification is skipped — fine for a first test,
//     but set it before relying on this in production.)
export const prerender = false;

interface Env {
  SLACK_SALES_WEBHOOK_URL?: string;
  SLACK_PARTNER_WEBHOOK_URL?: string;
  SLACK_AUDIT_WEBHOOK_URL?: string;
  CALENDLY_WEBHOOK_SIGNING_KEY?: string;
}

function readEnv(locals: App.Locals): Env {
  const e = (locals as { runtime?: { env?: Env } }).runtime?.env;
  return {
    SLACK_SALES_WEBHOOK_URL: e?.SLACK_SALES_WEBHOOK_URL ?? import.meta.env.SLACK_SALES_WEBHOOK_URL,
    SLACK_PARTNER_WEBHOOK_URL: e?.SLACK_PARTNER_WEBHOOK_URL ?? import.meta.env.SLACK_PARTNER_WEBHOOK_URL,
    SLACK_AUDIT_WEBHOOK_URL: e?.SLACK_AUDIT_WEBHOOK_URL ?? import.meta.env.SLACK_AUDIT_WEBHOOK_URL,
    CALENDLY_WEBHOOK_SIGNING_KEY:
      e?.CALENDLY_WEBHOOK_SIGNING_KEY ?? import.meta.env.CALENDLY_WEBHOOK_SIGNING_KEY,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Verify the "Calendly-Webhook-Signature: t=<ts>,v1=<hmac>" header. HMAC-SHA256
// over `${t}.${rawBody}` with the subscription signing key. Returns true when
// no signing key is configured (graceful no-op, matching the Turnstile pattern).
async function verifySignature(
  signingKey: string | undefined,
  header: string | null,
  rawBody: string
): Promise<boolean> {
  if (!signingKey) return true;
  if (!header) return false;

  const parts: Record<string, string> = {};
  for (const piece of header.split(",")) {
    const idx = piece.indexOf("=");
    if (idx > 0) parts[piece.slice(0, idx).trim()] = piece.slice(idx + 1).trim();
  }
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;

  // Reject stale signatures (replay guard), 5-minute tolerance.
  const ts = Number(t);
  if (Number.isFinite(ts) && Math.abs(Date.now() / 1000 - ts) > 300) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(signingKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${rawBody}`));
  const expected = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return timingSafeEqual(expected, v1);
}

function fmtWhen(startTime?: string, tz?: string): string {
  if (!startTime) return "time TBD";
  const d = new Date(startTime);
  if (Number.isNaN(d.valueOf())) return startTime;
  // Show in Atlantic time (where the team sits); note the invitee's own tz too.
  const atlantic = d.toLocaleString("en-US", {
    timeZone: "America/Halifax",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return tz ? `${atlantic} (invitee tz: ${tz})` : atlantic;
}

interface CalendlyPayload {
  name?: string;
  email?: string;
  timezone?: string;
  text_reminder_number?: string;
  reschedule_url?: string;
  cancel_url?: string;
  scheduled_event?: { name?: string; start_time?: string };
  cancellation?: { reason?: string; canceled_by?: string };
  questions_and_answers?: { question?: string; answer?: string }[];
}

function buildMessage(event: string, p: CalendlyPayload): string {
  const who = `${p.name ?? "Someone"}${p.email ? ` (${p.email})` : ""}`;
  const eventName = p.scheduled_event?.name ?? "Call";
  const when = fmtWhen(p.scheduled_event?.start_time, p.timezone);

  if (event === "invitee.canceled") {
    return [
      "*Call canceled* :x:",
      `*Who:* ${who}`,
      `*Event:* ${eventName}`,
      `*Was:* ${when}`,
      p.cancellation?.reason ? `*Reason:* ${p.cancellation.reason}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // invitee.created
  const qa = (p.questions_and_answers ?? [])
    .filter((x) => x.answer)
    .map((x) => `*${x.question ?? "Q"}:* ${x.answer}`);
  const links = [
    p.reschedule_url ? `<${p.reschedule_url}|Reschedule>` : null,
    p.cancel_url ? `<${p.cancel_url}|Cancel>` : null,
  ].filter(Boolean);

  return [
    "*New call booked* :calendar:",
    `*Who:* ${who}`,
    `*Event:* ${eventName}`,
    `*When:* ${when}`,
    p.text_reminder_number ? `*Phone:* ${p.text_reminder_number}` : null,
    ...qa,
    links.length ? links.join(" · ") : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function notifySlack(env: Env, text: string): Promise<void> {
  const webhook =
    env.SLACK_SALES_WEBHOOK_URL ?? env.SLACK_PARTNER_WEBHOOK_URL ?? env.SLACK_AUDIT_WEBHOOK_URL;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("Slack Calendly notification failed", err);
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = readEnv(locals);

  const rawBody = await request.text();
  const ok = await verifySignature(
    env.CALENDLY_WEBHOOK_SIGNING_KEY,
    request.headers.get("Calendly-Webhook-Signature"),
    rawBody
  );
  if (!ok) return json({ ok: false, error: "Invalid signature." }, 403);

  let data: { event?: string; payload?: CalendlyPayload };
  try {
    data = JSON.parse(rawBody) as { event?: string; payload?: CalendlyPayload };
  } catch {
    return json({ ok: false, error: "Invalid JSON." }, 400);
  }

  const event = data.event ?? "";
  // Only the booking lifecycle events are interesting; ack everything else so
  // Calendly doesn't retry.
  if (event !== "invitee.created" && event !== "invitee.canceled") {
    return json({ ok: true, ignored: event });
  }

  const payload = data.payload ?? {};
  await notifySlack(env, buildMessage(event, payload));

  const ae = (locals as { runtime?: { env?: { AE?: AnalyticsEngine } } }).runtime?.env?.AE;
  logEvent({ AE: ae }, "calendar_booking", {
    ip: clientIp(request),
    detail: event === "invitee.created" ? "booked" : "canceled",
    domain: payload.scheduled_event?.name,
  });

  return json({ ok: true });
};
