import type { APIRoute } from "astro";
import { clientIp, logEvent, type AnalyticsEngine } from "../../lib/eventlog";
import { verifyTurnstile } from "../../lib/turnstile";
import { rateLimit, type RateLimitKV } from "../../lib/ratelimit";

// Early-access questionnaire for the self serve website build.
//
// Flow: EarlyAccessForm.astro POSTs the answers here -> we post one message to
// the partner Slack channel (falling back to the audit channel) so the team can
// open access in order. No CRM sync: the list lives in Slack and, once they
// have an account, in Tideworthy.
//
// Runs on-demand inside the Cloudflare Worker (prerender = false). Cloudflare
// secrets are read from `locals.runtime.env`; `import.meta.env` is the
// local-dev fallback (Astro loads .env.local server-side).
export const prerender = false;

interface Env {
  SLACK_PARTNER_WEBHOOK_URL?: string;
  SLACK_AUDIT_WEBHOOK_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMIT?: RateLimitKV;
  AE?: AnalyticsEngine;
}

function readEnv(locals: App.Locals): Env {
  const runtimeEnv = (locals as { runtime?: { env?: Env } }).runtime?.env;
  return {
    SLACK_PARTNER_WEBHOOK_URL:
      runtimeEnv?.SLACK_PARTNER_WEBHOOK_URL ?? import.meta.env.SLACK_PARTNER_WEBHOOK_URL,
    SLACK_AUDIT_WEBHOOK_URL:
      runtimeEnv?.SLACK_AUDIT_WEBHOOK_URL ?? import.meta.env.SLACK_AUDIT_WEBHOOK_URL,
    TURNSTILE_SECRET_KEY:
      runtimeEnv?.TURNSTILE_SECRET_KEY ?? import.meta.env.TURNSTILE_SECRET_KEY,
    RATE_LIMIT: runtimeEnv?.RATE_LIMIT,
    AE: runtimeEnv?.AE,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SITES_PER_YEAR = new Set(["1-5", "6-15", "16-50", "50+"]);
const BUILDS_ON = new Set(["wordpress", "duda", "webflow", "wix-squarespace", "custom", "outsourced", "none"]);
const USE_FOR = new Set(["new-client-site", "rebuild", "location-pages", "prospect-demos"]);

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

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function list(v: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.map((x) => String(x)).filter((x) => allowed.has(x)))];
}

const LABELS: Record<string, string> = {
  wordpress: "WordPress",
  duda: "Duda",
  webflow: "Webflow",
  "wix-squarespace": "Wix or Squarespace",
  custom: "Custom code",
  outsourced: "Outsourced",
  none: "Does not build sites today",
  "new-client-site": "New site for a new client",
  rebuild: "Rebuild of an existing site",
  "location-pages": "Location or service pages",
  "prospect-demos": "Demo sites for prospects",
};

interface Submission {
  firstName: string;
  lastName: string;
  agencyName: string;
  website: string | null;
  email: string;
  platformAccount: string;
  sitesPerYear: string;
  buildsOn: string[];
  useFor: string[];
  exampleSite: string | null;
  notes: string;
  utm: Record<string, string>;
}

/** Notify Slack so the team can open access. Best-effort: never throws. */
async function notifySlack(env: Env, s: Submission): Promise<void> {
  const webhook = env.SLACK_PARTNER_WEBHOOK_URL || env.SLACK_AUDIT_WEBHOOK_URL;
  if (!webhook) return;
  const utm = Object.entries(s.utm)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ");
  const text = [
    "*Early access request: self serve website build* :hammer_and_wrench:",
    `*Name:* ${s.firstName} ${s.lastName}`.trim(),
    `*Agency:* ${s.agencyName}${s.website ? ` (${s.website})` : ""}`,
    `*Email:* ${s.email}`,
    `*Tideworthy account:* ${s.platformAccount === "yes" ? "yes" : "not yet"}`,
    s.sitesPerYear ? `*Sites a year:* ${s.sitesPerYear}` : null,
    s.buildsOn.length ? `*Builds on:* ${s.buildsOn.map((k) => LABELS[k] ?? k).join(", ")}` : null,
    s.useFor.length ? `*Would use it for:* ${s.useFor.map((k) => LABELS[k] ?? k).join(", ")}` : null,
    s.exampleSite ? `*First site to rebuild:* ${s.exampleSite}` : null,
    s.notes ? `*Notes:* ${s.notes}` : null,
    utm ? `*UTM:* ${utm}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    /* Slack is a courtesy; the submit still succeeds */
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = readEnv(locals);
  const ip = clientIp(request);

  const rl = await rateLimit(env.RATE_LIMIT, `early-access:${ip}`, 10, 3600);
  if (!rl.allowed) {
    logEvent(env, "early_access_rate_limited", { ip });
    return json({ ok: false, message: "Too many requests. Try again in a bit." }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, message: "Bad request." }, 400);
  }

  const human = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, str(body.turnstile, 4000), ip);
  if (!human) {
    logEvent(env, "early_access_turnstile_failed", { ip });
    return json({ ok: false, message: "We could not confirm you are a person. Reload and try again." }, 400);
  }

  const email = str(body.email).toLowerCase();
  const submission: Submission = {
    firstName: str(body.firstName, 80),
    lastName: str(body.lastName, 80),
    agencyName: str(body.agencyName, 120),
    website: normalizeUrl(str(body.website)),
    email,
    platformAccount: str(body.platformAccount, 10) === "yes" ? "yes" : "no",
    sitesPerYear: SITES_PER_YEAR.has(str(body.sitesPerYear, 10)) ? str(body.sitesPerYear, 10) : "",
    buildsOn: list(body.buildsOn, BUILDS_ON),
    useFor: list(body.useFor, USE_FOR),
    exampleSite: normalizeUrl(str(body.exampleSite)),
    notes: str(body.notes, 1500),
    utm: Object.fromEntries(
      Object.entries((body.utm as Record<string, unknown>) ?? {})
        .filter(([k, v]) => k.startsWith("utm_") && typeof v === "string" && v)
        .map(([k, v]) => [k.slice(0, 40), String(v).slice(0, 120)])
    ),
  };

  if (!submission.firstName || !submission.agencyName || !EMAIL_RE.test(email)) {
    return json({ ok: false, message: "Fill in your name, agency, and a work email." }, 400);
  }

  await notifySlack(env, submission);
  logEvent(env, "early_access_request", {
    ip,
    email,
    agency: submission.agencyName,
    sitesPerYear: submission.sitesPerYear,
    account: submission.platformAccount,
  });

  return json({ ok: true });
};
