// The platform's public price list, read at build time so the pricing page
// and the app can never drift: plan prices, the implementation add-on, the
// monthly maximums per deliverable family, the process cards and each plan's
// default package. Source: /api/public/pricing on the platform. A checked-in
// snapshot (platform-pricing.fallback.json) covers a build with the platform
// unreachable; refresh it with `npm run pricing:snapshot`.
//
// The marketing names (Tiny / Typical / Turbo) are applied here until the
// platform's own plan names catch up.

import fallback from "./platform-pricing.fallback.json";

export interface PlatformProcessCard {
  key: string;
  name: string;
  description: string;
  defaultCadence: string | null;
}

export interface PlatformPlan {
  key: string;
  name: string;
  priceCents: number;
  implementationCents: number;
  /** Tracked keywords per campaign on this plan (older feeds: absent, use the account-wide number). */
  trackedKeywords?: number;
  maximums: Record<string, number>;
  defaultPackage: {
    name: string;
    description: string | null;
    deliverables: { slug: string; quantity: number; contentType: string | null; rowKey: string; label: string }[];
    processes: { key: string; name: string; cadence: string | null }[];
  } | null;
}

export interface PlatformPricing {
  currency: string;
  cadRate: number;
  trialDays: number;
  trackedKeywords: number;
  processCards: PlatformProcessCard[];
  families: { key: string; label: string }[];
  /** The units a plan counts monthly. */
  deliverables: { slug: string; label: string; family: string | null }[];
  /** The units every plan includes with no monthly count: a checked row,
   *  and the family whose monthly row the comparison drops (older feeds:
   *  absent, nothing is included this way). */
  included?: { slug: string; label: string; family: string | null }[];
  plans: PlatformPlan[];
}

const DEFAULT_URL = "https://app.tideworthy.com/api/public/pricing";

export async function loadPlatformPricing(): Promise<{ data: PlatformPricing; source: "live" | "fallback" }> {
  const url = import.meta.env.PLATFORM_PRICING_URL || DEFAULT_URL;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as PlatformPricing;
    if (!Array.isArray(data.plans) || data.plans.length === 0) throw new Error("no plans");
    // An older platform build without the process cards and labels cannot
    // feed the comparison table; the snapshot can.
    if (!Array.isArray(data.processCards) || !Array.isArray(data.families)) {
      throw new Error("price list predates process cards");
    }
    // A feed that does not yet say which units are included would show
    // citations as a count again; the snapshot already has the shape.
    if (!Array.isArray(data.included)) throw new Error("price list predates included units");
    return { data, source: "live" };
  } catch (err) {
    console.warn(`[pricing] platform price list unavailable (${String(err)}), using snapshot`);
    return { data: fallback as unknown as PlatformPricing, source: "fallback" };
  }
}

/** Marketing identity per plan: the public name, the card accent, the fit line. */
export interface TierIdentity {
  name: string;
  accent: "teal" | "purple" | "green";
  featured?: boolean;
  blurb: string;
  bestFor: string;
}

export const TIER_IDENTITY: Record<string, TierIdentity> = {
  essentials: {
    name: "Tiny",
    accent: "teal",
    blurb:
      "The base managed campaign. Right for a single-location business in a low-competition market where steady fundamentals win.",
    bestFor: "Best for low-competition local",
  },
  growth: {
    name: "Typical",
    accent: "purple",
    featured: true,
    blurb:
      "Our most-quoted package. Full local campaign with content, links, Business Profile activity and citations, worked weekly.",
    bestFor: "Best for most local businesses",
  },
  scale: {
    name: "Turbo",
    accent: "green",
    blurb:
      "The most content, links and Business Profile activity we run on one campaign. For tougher markets, or when speed matters more.",
    bestFor: "Best for competitive and multi-location markets",
  },
};

/** The default package's monthly count per deliverable family. */
function packageCounts(pricing: PlatformPricing, plan: PlatformPlan): Record<string, number> {
  const familyOf = new Map(pricing.deliverables.map((d) => [d.slug, d.family]));
  const counts: Record<string, number> = {};
  for (const d of plan.defaultPackage?.deliverables ?? []) {
    const family = familyOf.get(d.slug);
    if (!family) continue;
    counts[family] = (counts[family] ?? 0) + d.quantity;
  }
  return counts;
}

export interface MarketingTier {
  key: string;
  name: string;
  /** Monthly wholesale price in USD. */
  price: number;
  implementation: number;
  blurb: string;
  highlights: string[];
  featured?: boolean;
  accent: "teal" | "purple" | "green";
  maximums: Record<string, number>;
  trackedKeywords: number;
  /** What the plan's default package delivers each month, by family. */
  counts: Record<string, number>;
  processes: { key: string; name: string; cadence: string | null }[];
}

/** The deliverables every plan includes without a count. */
function includedUnits(pricing: PlatformPricing): { slug: string; label: string; family: string | null }[] {
  return pricing.included ?? [];
}

/** The plans as the pricing page shows them: marketing names, the default package's counts. */
export function marketingTiers(pricing: PlatformPricing): MarketingTier[] {
  return pricing.plans.map((plan) => {
    const id = TIER_IDENTITY[plan.key] ?? {
      name: plan.name,
      accent: "teal" as const,
      blurb: plan.defaultPackage?.description ?? "",
      bestFor: "",
    };
    const m = plan.maximums;
    const c = packageCounts(pricing, plan);
    const specialist = plan.defaultPackage?.processes.find((p) => p.key === "ongoing-specialist-work-execution");
    const highlights = [
      `${c.guest_post_link ?? 0} backlinks and ${c.content ?? 0} content pieces a month`,
      `${c.gbp_post ?? 0} Business Profile posts a month`,
      specialist?.cadence ? `Specialist work ${specialist.cadence.toLowerCase()}` : null,
      id.bestFor || null,
    ].filter((h): h is string => Boolean(h));
    return {
      key: plan.key,
      name: id.name,
      price: plan.priceCents / 100,
      implementation: plan.implementationCents / 100,
      blurb: id.blurb,
      highlights,
      featured: id.featured,
      accent: id.accent,
      maximums: m,
      trackedKeywords: plan.trackedKeywords ?? pricing.trackedKeywords,
      counts: c,
      processes: plan.defaultPackage?.processes ?? [],
    };
  });
}

export interface ComparisonRow {
  label: string;
  values: (string | true)[];
  group?: string;
}

/** The comparison table: process cadences, the monthly counts, what every campaign includes. */
export function comparisonRows(pricing: PlatformPricing, tiers: MarketingTier[]): ComparisonRow[] {
  const rows: ComparisonRow[] = [];
  // Process cadence per tier, in the platform's card order. A tier that does
  // not name a card falls back to the card's default cadence.
  for (const card of pricing.processCards) {
    const values = tiers.map((t) => {
      const pick = t.processes.find((p) => p.key === card.key);
      return pick?.cadence ?? card.defaultCadence ?? "Included";
    });
    rows.push({ group: "How the campaign runs", label: card.name, values });
  }
  const familyLabel: Record<string, string> = {
    content: "Content pieces per month",
    guest_post_link: "Backlinks per month",
    gbp_post: "Business Profile posts per month",
    citation: "Citations per month",
  };
  const familyOrder = ["content", "guest_post_link", "gbp_post", "citation"];
  // A family every plan includes without a count has no monthly row; it is
  // a check under "In every campaign" instead.
  const includedFamilies = new Set(includedUnits(pricing).map((u) => u.family));
  const families = [...pricing.families]
    .filter((f) => !includedFamilies.has(f.key))
    .sort((a, b) => (familyOrder.indexOf(a.key) + 1 || 99) - (familyOrder.indexOf(b.key) + 1 || 99));
  for (const family of families) {
    rows.push({
      group: "Every month",
      label: familyLabel[family.key] ?? family.label,
      values: tiers.map((t) => String(t.counts[family.key] ?? 0)),
    });
  }
  for (const unit of includedUnits(pricing)) {
    rows.push({ group: "In every campaign", label: unit.label, values: tiers.map(() => true) });
  }
  rows.push({ group: "In every campaign", label: "Live reporting dashboard + AI visibility tracking", values: tiers.map(() => true) });
  rows.push({ group: "In every campaign", label: "Technical crawl review + fixes", values: tiers.map(() => true) });
  rows.push({
    group: "In every campaign",
    label: "Tracked keywords",
    values: tiers.map((t) => String(t.trackedKeywords)),
  });
  rows.push({
    group: "In every campaign",
    label: "Website changes implemented for you",
    values: tiers.map((t) => `+$${t.implementation}/mo`),
  });
  return rows;
}
