import type { APIRoute } from "astro";
import { clientIp } from "../../lib/eventlog";
import { rateLimit, type RateLimitKV } from "../../lib/ratelimit";

// Google Business Profile picker endpoint.
//
// The audit form's "Local audit" add-on calls this as the user types their
// business name. We proxy Google Places Autocomplete (New) server-side so the
// API key never reaches the browser, and return a short list of
// { placeId, name, address } suggestions for the user to pick from.
//
// Capturing the placeId here means /api/snapshot can later pull authoritative
// GBP data (rating, reviews, category, website) by ID instead of guessing from
// a free-text search — that's the whole point of the picker.
//
// Autocomplete is cheap relative to Text Search, but it's still a billed Google
// call on every keystroke-batch, so: min 3 chars, debounced client-side, and a
// generous per-IP cap here as a backstop.
export const prerender = false;

const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";
const TIMEOUT_MS = 6000;
const MIN_QUERY = 3;
const MAX_RESULTS = 5;

// Per-IP cap on suggestion lookups. A real session types a handful of queries;
// this only bites a scraper. No-ops until the RATE_LIMIT KV binding is wired.
const LOOKUP_LIMIT = 120;
const LOOKUP_WINDOW_SECONDS = 3600;

interface Env {
  GOOGLE_PLACES_API_KEY?: string;
}

function readEnv(locals: App.Locals): Env {
  const e = (locals as { runtime?: { env?: Env } }).runtime?.env;
  return {
    GOOGLE_PLACES_API_KEY:
      e?.GOOGLE_PLACES_API_KEY ?? import.meta.env.GOOGLE_PLACES_API_KEY,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function fetchWithTimeout(url: string, ms: number, init?: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

export const GET: APIRoute = async ({ request, locals }) => {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim();
  // Below the minimum we return an empty list rather than an error, so the
  // client can call freely as the user types without handling 400s.
  if (q.length < MIN_QUERY) return json({ ok: true, results: [] });

  const runtimeEnv = (locals as { runtime?: { env?: { RATE_LIMIT?: RateLimitKV } } }).runtime?.env;
  const rl = await rateLimit(runtimeEnv?.RATE_LIMIT, `places:${clientIp(request)}`, LOOKUP_LIMIT, LOOKUP_WINDOW_SECONDS);
  if (!rl.allowed) return json({ ok: false, error: "Too many lookups." }, 429);

  const env = readEnv(locals);
  if (!env.GOOGLE_PLACES_API_KEY) {
    // No key (e.g. local dev without secrets). Tell the client so it can fall
    // back to the manual business-name + city fields instead of spinning.
    return json({ ok: false, error: "unavailable", results: [] });
  }

  try {
    const res = await fetchWithTimeout(AUTOCOMPLETE_URL, TIMEOUT_MS, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask":
          "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat",
      },
      body: JSON.stringify({ input: q }),
    });
    if (!res.ok) return json({ ok: false, error: `places ${res.status}`, results: [] });

    const data = (await res.json()) as any;
    const results = (data.suggestions ?? [])
      .map((s: any) => s.placePrediction)
      .filter(Boolean)
      .slice(0, MAX_RESULTS)
      .map((p: any) => ({
        placeId: p.placeId as string,
        name: (p.structuredFormat?.mainText?.text ?? "") as string,
        address: (p.structuredFormat?.secondaryText?.text ?? "") as string,
      }))
      .filter((r: { placeId: string; name: string }) => r.placeId && r.name);

    return json({ ok: true, results });
  } catch (err) {
    return json({ ok: false, error: err instanceof Error ? err.message : "lookup failed", results: [] });
  }
};
