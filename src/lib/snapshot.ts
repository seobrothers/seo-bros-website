// Snapshot engine: the modules behind the instant "free discovery".
// Each module degrades gracefully — a missing key or API hiccup returns
// { ok: false } rather than throwing, so one failing module never kills the run.
//
// Modules:
//   runSeo   — Google PageSpeed Insights (speed, SEO, accessibility, best-practices)
//   runLocal — Google Places (GBP presence, rating, reviews) [Local audit]
//   buildReport — one LLM call that synthesizes everything into a plain-English,
//                 prioritized report, including the AI-citation assessment when asked.
import { complete, parseJsonLoose, hasLlm, type LlmEnv } from "./llm";

// Subset of the Workbench team-tools RPC entrypoint (TeamToolsRpc) we call via
// a Cloudflare service binding. team-tools owns the API keys + normalization,
// so when this binding is present we prefer it over calling Google directly.
export interface TeamToolsBinding {
  pagespeedRunTest(params: {
    url: string;
    strategy?: "mobile" | "desktop";
    include_recommendations?: boolean;
  }): Promise<{
    metrics: {
      performance: number | null;
      seo: number | null;
      accessibility: number | null;
      best_practices: number | null;
      lcp_s: number | null;
      cls: number | null;
    };
    recommendations?: unknown;
  }>;
}

export interface SnapshotEnv extends LlmEnv {
  GOOGLE_PAGE_SPEED_INSIGHTS_API?: string;
  GOOGLE_PLACES_API_KEY?: string;
  TEAM_TOOLS?: TeamToolsBinding;
}

export type AuditType = "seo" | "local" | "ai";

export interface SeoModule {
  ok: boolean;
  performance?: number | null;
  seo?: number | null;
  accessibility?: number | null;
  bestPractices?: number | null;
  lcp?: number | null;
  cls?: number | null;
  topIssues?: string[];
  error?: string;
}

export interface LocalModule {
  ok: boolean;
  found?: boolean;
  name?: string;
  rating?: number | null;
  reviews?: number | null;
  // Enriched via the team-tools googlePlacesDetails binding when available.
  category?: string | null;
  status?: string | null;
  hasWebsite?: boolean;
  error?: string;
}

export interface ReportSection {
  /** e.g. "Local SEO", "Technical SEO", "On-Page SEO", "Content", "AI Search". */
  category: string;
  items: Array<{ title: string; detail: string }>;
}

export interface Report {
  headline: string;
  summary: string;
  sections: ReportSection[];
}

const PSI_BASE = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

// PageSpeed on a real site can take 30-60s; cap it so the snapshot stays fast.
// If PSI doesn't finish in time, the report is built from the other modules and
// the results page shows a "scores unavailable" note. Tune as needed.
const PSI_TIMEOUT_MS = 30000;
const PLACES_TIMEOUT_MS = 10000;

async function fetchWithTimeout(url: string, ms: number, init?: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Resolve a promise, or reject with a timeout after ms (for RPC binding calls). */
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timeout`)), ms)),
  ]);
}

export async function runSeo(env: SnapshotEnv, url: string): Promise<SeoModule> {
  // Prefer the Workbench team-tools worker (service binding): it owns the
  // PageSpeed key, normalizes the payload, and isn't subject to the per-IP
  // keyless rate limit. Falls through to a direct PSI call if the binding
  // isn't available (e.g. local `astro dev`, or before it's wired in prod).
  if (env.TEAM_TOOLS?.pagespeedRunTest) {
    try {
      const r = await withTimeout(
        env.TEAM_TOOLS.pagespeedRunTest({
          url,
          strategy: "mobile",
          include_recommendations: true,
        }),
        PSI_TIMEOUT_MS,
        "PSI binding"
      );
      const m = r.metrics;
      return {
        ok: true,
        performance: m.performance ?? null,
        seo: m.seo ?? null,
        accessibility: m.accessibility ?? null,
        bestPractices: m.best_practices ?? null,
        lcp: m.lcp_s ?? null,
        cls: m.cls ?? null,
        topIssues: [],
      };
    } catch (err) {
      console.error("team-tools pagespeedRunTest failed, falling back to direct PSI", err);
    }
  }

  try {
    const params = new URLSearchParams({ url, strategy: "mobile" });
    for (const c of ["performance", "seo", "accessibility", "best-practices"]) {
      params.append("category", c);
    }
    if (env.GOOGLE_PAGE_SPEED_INSIGHTS_API) params.set("key", env.GOOGLE_PAGE_SPEED_INSIGHTS_API);

    // PSI intermittently returns 5xx/429. Retry once on those (they fail fast).
    // A timeout/abort already cost the full window, so don't retry that.
    let res: Response;
    let attempt = 0;
    while (true) {
      res = await fetchWithTimeout(`${PSI_BASE}?${params}`, PSI_TIMEOUT_MS);
      if (res.ok) break;
      const retryable = res.status >= 500 || res.status === 429;
      if (!retryable || attempt >= 1) break;
      attempt++;
      await new Promise((r) => setTimeout(r, 500));
    }
    if (!res.ok) return { ok: false, error: `PSI ${res.status}` };
    const data = (await res.json()) as any;
    const cats = data.lighthouseResult?.categories ?? {};
    const audits = data.lighthouseResult?.audits ?? {};

    const score = (c: string) =>
      cats[c]?.score != null ? Math.round(cats[c].score * 100) : null;

    const topIssues = Object.values<any>(audits)
      .filter((a) => typeof a?.score === "number" && a.score < 0.9 && a.title)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map((a) => a.title as string);

    return {
      ok: true,
      performance: score("performance"),
      seo: score("seo"),
      accessibility: score("accessibility"),
      bestPractices: score("best-practices"),
      lcp:
        audits["largest-contentful-paint"]?.numericValue != null
          ? Math.round((audits["largest-contentful-paint"].numericValue / 1000) * 10) / 10
          : null,
      cls:
        audits["cumulative-layout-shift"]?.numericValue != null
          ? Math.round(audits["cumulative-layout-shift"].numericValue * 1000) / 1000
          : null,
      topIssues,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "PSI failed" };
  }
}

export async function runLocal(
  env: SnapshotEnv,
  businessName: string,
  city: string
): Promise<LocalModule> {
  try {
    if (!env.GOOGLE_PLACES_API_KEY) return { ok: false, error: "Places key not configured" };

    // Places API (New) v1 — matches the GOOGLE_PLACES_API_KEY (New API) and
    // returns rating, review count, category, status, and website in one call.
    const res = await fetchWithTimeout(
      "https://places.googleapis.com/v1/places:searchText",
      PLACES_TIMEOUT_MS,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.rating,places.userRatingCount,places.primaryType,places.businessStatus,places.websiteUri",
        },
        body: JSON.stringify({ textQuery: `${businessName} ${city}`.trim() }),
      }
    );
    if (!res.ok) return { ok: false, error: `Places ${res.status}` };
    const data = (await res.json()) as any;
    const top = data.places?.[0];
    if (!top) return { ok: true, found: false };

    return {
      ok: true,
      found: true,
      name: top.displayName?.text ?? businessName,
      rating: top.rating ?? null,
      reviews: top.userRatingCount ?? null,
      category: top.primaryType ?? null,
      status: top.businessStatus ?? null,
      hasWebsite: top.websiteUri ? true : false,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Places failed" };
  }
}

interface ReportInput {
  url: string;
  types: AuditType[];
  seo: SeoModule | null;
  local: LocalModule | null;
  businessName?: string;
  city?: string;
  service?: string;
}

const SYSTEM = `You are a senior SEO analyst at SEO Brothers, a Local SEO company that sells direct to local and service businesses.
Write a short, honest, plain-English discovery for a business owner who just requested a free audit.
Rules: no jargon dumps, no fabricated metrics, no hype. Be specific and prioritized. If data is missing, don't invent it.
Return ONLY valid JSON, no markdown fences.`;

function reportUserPrompt(input: ReportInput): string {
  const lines: string[] = [];
  lines.push(`Website: ${input.url}`);
  if (input.businessName) lines.push(`Business: ${input.businessName}`);
  if (input.city) lines.push(`City: ${input.city}`);
  if (input.service) lines.push(`Primary service: ${input.service}`);
  lines.push(`Audits requested: ${input.types.join(", ")}`);

  if (input.seo?.ok) {
    lines.push(
      `\nPageSpeed/SEO data (mobile, 0-100): performance=${input.seo.performance}, seo=${input.seo.seo}, accessibility=${input.seo.accessibility}, bestPractices=${input.seo.bestPractices}, LCP=${input.seo.lcp}s, CLS=${input.seo.cls}.`
    );
    if (input.seo.topIssues?.length) lines.push(`Top flagged issues: ${input.seo.topIssues.join("; ")}.`);
  } else if (input.types.includes("seo")) {
    lines.push(`\nPageSpeed/SEO data: unavailable.`);
  }

  if (input.local?.ok) {
    if (input.local.found) {
      const reviewsKnown = typeof input.local.reviews === "number";
      const reviewBit = reviewsKnown
        ? `${input.local.rating ?? "?"} stars from ${input.local.reviews} reviews`
        : "review data unavailable";
      const extra = [
        input.local.category ? `category "${input.local.category}"` : null,
        input.local.status && input.local.status !== "OPERATIONAL" ? `status ${input.local.status}` : null,
        input.local.hasWebsite === false ? "no website listed on the profile" : null,
      ]
        .filter(Boolean)
        .join(", ");
      lines.push(
        `\nGoogle Business Profile: FOUND and claimed — "${input.local.name}", ${reviewBit}${extra ? `; ${extra}` : ""}. The business already has a GBP, so do NOT suggest claiming or creating one. Only mention reviews/optimization if the data clearly supports it.`
      );
    } else {
      lines.push(`\nGoogle Business Profile: NOT found for this business in that city (a major local-visibility gap; here it's fair to recommend claiming/creating one).`);
    }
  } else if (input.types.includes("local")) {
    lines.push(`\nGoogle Business Profile data: unavailable.`);
  }

  const wantsAi = input.types.includes("ai");

  // The audit areas the report must cover — one section each, so every audit the
  // user toggled on is represented (even if an area is strong).
  const required: string[] = [];
  if (input.seo?.ok) required.push("Technical SEO", "On-Page SEO");
  if (input.local?.ok && input.local.found) required.push("Local SEO");
  if (wantsAi) required.push("AI Search");
  const requiredList = required.length ? required.join(", ") : "Next step";

  lines.push(`\nReturn JSON with this exact shape:
{
  "headline": "one honest sentence on where they stand",
  "summary": "2-3 sentences, plain English",
  "sections": [
    { "category": "<section name>", "items": [{ "title": "short", "detail": "1-2 sentences, specific and actionable" }] }
  ]
}
Include one section for EACH of these areas: ${requiredList}. If an area is strong,
still include it with a brief note on what's working and the single best next lever,
rather than dropping it. You may add a "Content" section if clearly relevant.${wantsAi ? ` For "AI Search", assess how AI search likely sees this business for '${input.service ?? "their service"}' in ${input.city ?? "their area"} and what to fix (entity/schema, citation-ready content, presence on the sources AI pulls from).` : ""}
Order sections by impact, 1-4 items each. Base everything on the data above; do not invent numbers.`);

  return lines.join("\n");
}

/** Deterministic fallback report when the LLM is unavailable or returns junk. */
function fallbackReport(input: ReportInput): Report {
  const sections: ReportSection[] = [];
  const s = input.seo;
  if (s?.ok) {
    const tech: ReportSection["items"] = [];
    if (s.performance != null && s.performance < 70)
      tech.push({ title: "Improve site speed", detail: `Mobile performance scored ${s.performance}/100. Slow pages lose rankings and customers.` });
    if (s.topIssues?.length)
      tech.push({ title: "Address flagged issues", detail: s.topIssues.slice(0, 3).join("; ") });
    if (tech.length) sections.push({ category: "Technical SEO", items: tech });

    if (s.seo != null && s.seo < 90)
      sections.push({
        category: "On-Page SEO",
        items: [{ title: "Fix on-page basics", detail: `The on-page SEO check scored ${s.seo}/100. ${s.topIssues?.[0] ?? "Several fixable issues were flagged."}` }],
      });
  }
  if (input.local?.ok) {
    sections.push({
      category: "Local SEO",
      items: [
        input.local.found
          ? { title: "Strengthen your Google Business Profile", detail: "Keep the profile complete and grow reviews to lift map-pack visibility." }
          : { title: "Claim your Google Business Profile", detail: "We couldn't find your profile in that market. For local search, this is the single biggest miss." },
      ],
    });
  }
  if (sections.length === 0)
    sections.push({ category: "Next step", items: [{ title: "Book a human audit", detail: "We'll dig into the specifics with you on a quick call." }] });

  return {
    headline: "Here's a first look at where your site stands.",
    summary: "This is an automated first pass. The biggest opportunities are below; our team can go deeper by hand on a call.",
    sections,
  };
}

export async function buildReport(env: SnapshotEnv, input: ReportInput): Promise<Report> {
  if (!hasLlm(env)) return fallbackReport(input);
  try {
    const text = await complete(env, { system: SYSTEM, user: reportUserPrompt(input), maxTokens: 1600 });
    const parsed = parseJsonLoose<Report>(text);
    if (parsed && parsed.headline && Array.isArray(parsed.sections) && parsed.sections.length) {
      return parsed;
    }
    return fallbackReport(input);
  } catch {
    return fallbackReport(input);
  }
}
