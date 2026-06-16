import type { APIRoute } from "astro";
import { syncContact, addToList, applyTag } from "../../lib/activecampaign";
import { clientIp, logEvent, type AnalyticsEngine } from "../../lib/eventlog";
import { rateLimit, type RateLimitKV } from "../../lib/ratelimit";

// Guides/newsletter subscribe. Email + chosen topics. Each topic maps to an AC
// list + tag; the visitor self-segments. Local Market Research is intentionally
// NOT a topic (you don't subscribe to a city). Soft signup — no Slack ping.
//
export const prerender = false;

// SEO topic == Bros Knows (same list, 26). Agency = 28. Build/Product = 27.
const TOPICS: Record<string, { list: number; tag: string; label: string }> = {
  seo: { list: 26, tag: "Bros Knows", label: "SEO" },
  agency: { list: 28, tag: "Agency Updates", label: "Agency" },
  build: { list: 27, tag: "Building in Public", label: "Build/Product" },
};

interface Env {
  ACTIVECAMPAIGN_API_URL?: string;
  ACTIVECAMPAIGN_API_KEY?: string;
}

function readEnv(locals: App.Locals): Env {
  const e = (locals as { runtime?: { env?: Env } }).runtime?.env;
  return {
    ACTIVECAMPAIGN_API_URL: e?.ACTIVECAMPAIGN_API_URL ?? import.meta.env.ACTIVECAMPAIGN_API_URL,
    ACTIVECAMPAIGN_API_KEY: e?.ACTIVECAMPAIGN_API_KEY ?? import.meta.env.ACTIVECAMPAIGN_API_KEY,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  if (typeof payload.phoneNumber === "string" && payload.phoneNumber.trim() !== "") {
    return json({ ok: true });
  }

  const kv = (locals as { runtime?: { env?: { RATE_LIMIT?: RateLimitKV } } }).runtime?.env?.RATE_LIMIT;
  const ip = clientIp(request);
  const rl = await rateLimit(kv, `subscribe:${ip}`, 20, 3600);
  if (!rl.allowed) return json({ ok: false, error: "Too many requests. Please try again later." }, 429);

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const topics = (Array.isArray(payload.topics) ? payload.topics : [])
    .map((t) => String(t))
    .filter((t) => t in TOPICS);

  if (!EMAIL_RE.test(email)) return json({ ok: false, error: "Please enter a valid email." }, 400);
  if (topics.length === 0) return json({ ok: false, error: "Pick at least one topic to subscribe to." }, 400);

  const env = readEnv(locals);
  const base = env.ACTIVECAMPAIGN_API_URL;
  const token = env.ACTIVECAMPAIGN_API_KEY;

  const [firstName, ...rest] = name.split(/\s+/);

  // Subscribe is best-effort: a missing-creds or AC outage must not error
  // lead-side. Unlike the lead forms there's no Slack fallback here, so the
  // attempt is still recorded via the analytics event below.
  if (base && token) {
    const ac = { base, token };
    try {
      const contactId = await syncContact(ac, { email, firstName: firstName ?? "", lastName: rest.join(" ") });
      for (const t of topics) {
        const { list, tag } = TOPICS[t];
        if (list > 0) {
          try {
            await addToList(ac, contactId, list);
          } catch (err) {
            console.error(`AC subscribe list ${list} failed`, err);
          }
        }
        await applyTag(ac, contactId, tag);
      }
    } catch (err) {
      console.error("ActiveCampaign subscribe failed (non-fatal)", err);
    }
  } else {
    console.error("ActiveCampaign credentials are not configured (subscribe skipped)");
  }

  const ae = (locals as { runtime?: { env?: { AE?: AnalyticsEngine } } }).runtime?.env?.AE;
  logEvent({ AE: ae }, "subscribe", { ip, detail: topics.join("|") });

  return json({ ok: true });
};
