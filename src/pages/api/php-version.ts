import type { APIRoute } from "astro";
import { clientIp, logEvent, type AnalyticsEngine } from "../../lib/eventlog";
import { rateLimit, type RateLimitKV } from "../../lib/ratelimit";
import { phpStatus, toBranch, type PhpStatus } from "../../data/php-versions";

// Backs /tools/php-version-checker/. Fetches a site from the edge and reports
// what the server volunteers about itself: the PHP version if it is exposed in
// the X-Powered-By or Server header, whether it is WordPress (and which
// version, if the generator tag is present), and what server or CDN fronts it.
//
// Honesty note: most hosts strip the PHP version from headers on purpose, and
// that is the right configuration. When nothing is exposed we say so rather
// than guess. There is no reliable way to read a server's PHP version from
// outside beyond these headers.
//
// Cheap per call (one or two fetches, no third-party APIs), so the rate limit
// is loose. Results cache at the edge for an hour per URL.
export const prerender = false;

const LIMIT = 30;
const WINDOW_SECONDS = 3600;
const CACHE_SECONDS = 3600;
const FETCH_TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 200_000;
const UA = "Mozilla/5.0 (compatible; SEOBrothersPHPCheck/1.0; +https://seobrothers.com/tools/php-version-checker/)";

export interface PhpCheckResult {
  ok: true;
  url: string;
  finalUrl: string;
  httpStatus: number;
  php: { version: string; branch: string | null; status: PhpStatus; source: "x-powered-by" | "server" } | null;
  wordpress: { detected: boolean; version: string | null };
  server: string | null;
  poweredBy: string | null;
  platform: string[];
  checkedAt: string;
}

function json(body: unknown, status = 200, cacheSeconds = 0): Response {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (cacheSeconds > 0) headers["cache-control"] = `public, max-age=${cacheSeconds}`;
  return new Response(JSON.stringify(body), { status, headers });
}

function normalizeUrl(raw: string): string | null {
  const trimmed = (raw || "").trim();
  if (!trimmed || trimmed.length > 2048) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    const host = u.hostname.toLowerCase();
    // Public hostnames only. No bare IPs, no localhost-style names.
    if (!host.includes(".")) return null;
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith("[")) return null;
    if (host.endsWith(".local") || host.endsWith(".internal")) return null;
    u.hash = "";
    return u.href;
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

async function readSome(res: Response, max: number): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < max) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    total += value.byteLength;
  }
  try {
    await reader.cancel();
  } catch {
    /* ignore */
  }
  const merged = new Uint8Array(Math.min(total, max));
  let off = 0;
  for (const c of chunks) {
    const slice = c.subarray(0, Math.max(0, Math.min(c.byteLength, max - off)));
    merged.set(slice, off);
    off += slice.byteLength;
    if (off >= max) break;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(merged);
}

const PHP_RE = /PHP\/?\s*v?(\d+\.\d+(?:\.\d+)?)/i;

// Friendly names for the platforms a site reveals through headers. Order
// matters only for display.
function detectPlatform(h: Headers, html: string): string[] {
  const out = new Set<string>();
  const server = (h.get("server") ?? "").toLowerCase();
  const powered = (h.get("x-powered-by") ?? "").toLowerCase();
  const lowerHtml = html.toLowerCase();

  if (server.includes("cloudflare") || h.has("cf-ray")) out.add("Cloudflare");
  if (server.includes("akamai")) out.add("Akamai");
  if (server.includes("litespeed") || h.has("x-litespeed-cache")) out.add("LiteSpeed");
  if (server.includes("nginx")) out.add("nginx");
  if (server.includes("apache")) out.add("Apache");
  if (server.includes("microsoft-iis")) out.add("IIS");
  if (server.includes("vercel") || h.has("x-vercel-id")) out.add("Vercel");
  if (server.includes("netlify") || h.has("x-nf-request-id")) out.add("Netlify");
  if (powered.includes("wp engine") || h.has("x-wpe-request-id")) out.add("WP Engine");
  if (h.has("x-kinsta-cache")) out.add("Kinsta");
  if (powered.includes("wordpress vip")) out.add("WordPress VIP");
  if (powered.includes("plesk")) out.add("Plesk");
  if (powered.includes("express")) out.add("Express (Node.js)");
  if (powered.includes("next.js") || h.has("x-nextjs-cache")) out.add("Next.js");
  if (h.has("x-shopify-stage") || h.has("x-shopid")) out.add("Shopify");
  if (h.has("x-wix-request-id")) out.add("Wix");
  if (server.includes("squarespace")) out.add("Squarespace");
  if (h.has("x-sucuri-id")) out.add("Sucuri");
  if (lowerHtml.includes("astro-island") || lowerHtml.includes('name="generator" content="astro') || lowerHtml.includes('"/_astro/')) out.add("Astro");
  return [...out];
}

function detectWordPress(h: Headers, html: string): { detected: boolean; version: string | null } {
  const link = h.get("link") ?? "";
  const gen = /<meta\s+name=["']generator["']\s+content=["']WordPress(?:\s+([\d.]+))?["']/i.exec(html);
  const detected =
    link.includes("api.w.org") ||
    /\/wp-content\/|\/wp-includes\/|\/wp-json\//i.test(html) ||
    !!gen;
  return { detected, version: gen?.[1] ?? null };
}

export const GET: APIRoute = async ({ request, locals }) => {
  const params = new URL(request.url).searchParams;
  const url = normalizeUrl(params.get("url") ?? "");
  if (!url) return json({ ok: false, error: "Enter a valid website address, like example.com." }, 400);

  const ip = clientIp(request);
  const domain = new URL(url).hostname;
  const runtimeEnv = (locals as { runtime?: { env?: { AE?: AnalyticsEngine; RATE_LIMIT?: RateLimitKV } } })
    .runtime?.env;
  const logCtx = { AE: runtimeEnv?.AE };

  type EdgeCache = {
    match: (r: Request) => Promise<Response | undefined>;
    put: (r: Request, res: Response) => Promise<void>;
  };
  const cache = (globalThis as { caches?: { default?: EdgeCache } }).caches?.default;
  if (cache) {
    const hit = await cache.match(request);
    if (hit) {
      logEvent(logCtx, "php_check", { ip, domain, cached: true });
      return hit;
    }
  }

  const rl = await rateLimit(runtimeEnv?.RATE_LIMIT, `phpcheck:${ip}`, LIMIT, WINDOW_SECONDS);
  if (!rl.allowed) {
    logEvent(logCtx, "php_check_ratelimited", { ip, domain });
    return new Response(
      JSON.stringify({ ok: false, error: "Too many checks from your connection. Please try again in a bit." }),
      { status: 429, headers: { "content-type": "application/json", "retry-after": String(rl.retryAfter ?? 600) } }
    );
  }

  let res: Response;
  try {
    res = await fetchWithTimeout(url, {
      method: "GET",
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
    });
  } catch (err) {
    const msg = err instanceof Error && err.name === "AbortError" ? "That site took too long to respond." : "We couldn't reach that site.";
    logEvent(logCtx, "php_check_failed", { ip, domain, error: msg });
    return json({ ok: false, error: `${msg} Check the address and try again.` }, 502);
  }

  const html = (res.headers.get("content-type") ?? "").includes("html") ? await readSome(res, MAX_HTML_BYTES) : "";
  // Nothing else is read from the body; drop it.
  try {
    await res.body?.cancel();
  } catch {
    /* already consumed or cancelled */
  }

  const poweredBy = res.headers.get("x-powered-by");
  const server = res.headers.get("server");

  let php: PhpCheckResult["php"] = null;
  const fromPowered = poweredBy ? PHP_RE.exec(poweredBy) : null;
  const fromServer = server ? PHP_RE.exec(server) : null;
  const hit = fromPowered ? { m: fromPowered, source: "x-powered-by" as const } : fromServer ? { m: fromServer, source: "server" as const } : null;
  if (hit) {
    const version = hit.m[1];
    const branch = toBranch(version);
    php = { version, branch, status: branch ? phpStatus(branch) : "unknown", source: hit.source };
  }

  const result: PhpCheckResult = {
    ok: true,
    url,
    finalUrl: res.url || url,
    httpStatus: res.status,
    php,
    wordpress: detectWordPress(res.headers, html),
    server,
    poweredBy,
    platform: detectPlatform(res.headers, html),
    checkedAt: new Date().toISOString(),
  };

  logEvent(logCtx, "php_check", {
    ip,
    domain,
    cached: false,
    exposed: !!php,
    branch: php?.branch ?? "",
    wordpress: result.wordpress.detected,
  });

  const response = json(result, 200, CACHE_SECONDS);
  if (cache) {
    try {
      await cache.put(request, response.clone());
    } catch {
      /* cache is best effort */
    }
  }
  return response;
};
