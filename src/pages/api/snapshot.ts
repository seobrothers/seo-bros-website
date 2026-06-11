import type { APIRoute } from "astro";
import {
  runSeo,
  runLocal,
  buildReport,
  type SnapshotEnv,
  type AuditType,
} from "../../lib/snapshot";
import { clientIp, logEvent, type AnalyticsEngine } from "../../lib/eventlog";
import { rateLimit, type RateLimitKV } from "../../lib/ratelimit";

// Expensive compute (PageSpeed + Places + LLM) per fresh URL, so cap fresh runs
// per IP. Cache hits don't count.
const SNAPSHOT_LIMIT = 8;
const SNAPSHOT_WINDOW_SECONDS = 3600;

// The "free discovery" compute endpoint. The crunching/results page calls this
// (GET, so it's cacheable) after the lead has already been captured by the form
// via /api/audit. This does NOT touch ActiveCampaign — it only runs the audit
// modules (PageSpeed, Places, LLM) and returns the report as JSON.
//
// Abuse/cost control: results are cached per query (Cloudflare Cache API, 24h),
// so repeat loads of the same site are free. IP rate-limiting (needs a KV
// namespace) is a documented fast-follow if abuse shows up.
export const prerender = false;

function readEnv(locals: App.Locals): SnapshotEnv {
  const e = (locals as { runtime?: { env?: SnapshotEnv } }).runtime?.env;
  const ime = import.meta.env as unknown as Record<string, string | undefined>;
  const pick = (k: keyof SnapshotEnv) => (e?.[k] as string | undefined) ?? ime[k as string];
  return {
    GOOGLE_PAGE_SPEED_INSIGHTS_API: pick("GOOGLE_PAGE_SPEED_INSIGHTS_API"),
    GOOGLE_PLACES_API_KEY: pick("GOOGLE_PLACES_API_KEY"),
    ANTHROPIC_API_KEY: pick("ANTHROPIC_API_KEY"),
    ANTHROPIC_MODEL: pick("ANTHROPIC_MODEL"),
    OPENAI_API_KEY: pick("OPENAI_API_KEY"),
    OPENAI_MODEL: pick("OPENAI_MODEL"),
    // Service binding (only present on the Cloudflare runtime env, never in
    // import.meta.env). Undefined locally → snapshot falls back to direct APIs.
    TEAM_TOOLS: e?.TEAM_TOOLS,
  };
}

function json(body: unknown, status = 200, cacheSeconds = 0): Response {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (cacheSeconds > 0) headers["cache-control"] = `public, max-age=${cacheSeconds}`;
  return new Response(JSON.stringify(body), { status, headers });
}

function normalizeUrl(raw: string): string | null {
  const trimmed = (raw || "").trim();
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

export const GET: APIRoute = async ({ request, locals }) => {
  const params = new URL(request.url).searchParams;
  const url = normalizeUrl(params.get("url") ?? "");
  if (!url) return json({ ok: false, error: "A valid website URL is required." }, 400);

  const types = (params.get("types") ?? "seo")
    .split(",")
    .map((t) => t.trim())
    .filter((t): t is AuditType => t === "seo" || t === "local" || t === "ai");
  const wantedTypes: AuditType[] = types.length ? types : ["seo"];

  const businessName = (params.get("business") ?? "").trim();
  const city = (params.get("city") ?? "").trim();
  const service = (params.get("service") ?? "").trim();
  // Captured by the audit form's GBP picker — lets runLocal pull the exact
  // profile by id instead of guessing from a text search.
  const placeId = (params.get("placeId") ?? "").trim();

  const ip = clientIp(request);
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    /* validated above */
  }
  const runtimeEnv = (locals as { runtime?: { env?: { AE?: AnalyticsEngine; RATE_LIMIT?: RateLimitKV } } })
    .runtime?.env;
  const ae = runtimeEnv?.AE;
  const logCtx = { AE: ae };

  // Serve a cached result for the same query if we have one. Typed structurally
  // so we don't depend on the Worker `Cache` global being in the Node build's lib.
  type EdgeCache = {
    match: (r: Request) => Promise<Response | undefined>;
    put: (r: Request, res: Response) => Promise<void>;
  };
  const cache = (globalThis as { caches?: { default?: EdgeCache } }).caches?.default;
  if (cache) {
    const hit = await cache.match(request);
    if (hit) {
      logEvent(logCtx, "snapshot", { ip, domain, types: wantedTypes.join("|"), cached: true });
      return hit;
    }
  }

  // Cache miss → this will do the expensive work. Rate-limit fresh runs per IP.
  const rl = await rateLimit(runtimeEnv?.RATE_LIMIT, `snapshot:${ip}`, SNAPSHOT_LIMIT, SNAPSHOT_WINDOW_SECONDS);
  if (!rl.allowed) {
    logEvent(logCtx, "snapshot_ratelimited", { ip, domain });
    return new Response(
      JSON.stringify({ ok: false, error: "Too many audits from your connection. Please try again in a bit." }),
      { status: 429, headers: { "content-type": "application/json", "retry-after": String(rl.retryAfter ?? 600) } }
    );
  }

  const env = readEnv(locals);

  // Run the data modules in parallel; the LLM synthesis runs after.
  const [seo, local] = await Promise.all([
    wantedTypes.includes("seo") ? runSeo(env, url) : Promise.resolve(null),
    wantedTypes.includes("local") && (placeId || (businessName && city))
      ? runLocal(env, { businessName, city, placeId })
      : Promise.resolve(null),
  ]);

  const report = await buildReport(env, {
    url,
    types: wantedTypes,
    seo,
    local,
    businessName,
    city,
    service,
  });

  logEvent(logCtx, "snapshot", {
    ip,
    domain,
    types: wantedTypes.join("|"),
    cached: false,
    seoOk: seo?.ok ?? false,
  });

  const response = json({ ok: true, url, types: wantedTypes, seo, local, report }, 200, 86400);

  if (cache) {
    try {
      await cache.put(request, response.clone());
    } catch {
      /* non-cacheable in this context — fine */
    }
  }
  return response;
};
