// Single source of truth for SEO Brothers' white-label rates.
//
// These are the WHOLESALE / partner prices an agency pays us. The agency marks
// them up to their own client. The /pricing/ page, the package builder
// (src/components/PackageBuilder.astro), and the web-design page all read from
// here so the numbers never drift apart. Update a price once, here.

export interface SeoTier {
  id: "tiny" | "typical" | "turbo";
  name: string;
  /** Monthly wholesale price in USD. */
  price: number;
  blurb: string;
  highlights: string[];
  featured?: boolean;
  accent: "teal" | "purple" | "green";
}

export const SEO_TIERS: SeoTier[] = [
  {
    id: "tiny",
    name: "Tiny",
    price: 360,
    blurb:
      "Base-level managed campaign. Right for ultra-low-competition industries or sparsely-populated locations where steady fundamentals win.",
    highlights: [
      "Semi-annual strategy review",
      "1 backlink + 1.5 hours of SEO Time each month",
      "Best for low-competition local",
    ],
    accent: "teal",
  },
  {
    id: "typical",
    name: "Typical",
    price: 680,
    blurb:
      "Our most-quoted package. Full-stack local SEO with content, links, Maps, and SEO Time directed at the Priority Intents that move the campaign.",
    highlights: [
      "Quarterly strategy + monthly content",
      "2 backlinks + 3.5 hours of SEO Time each month",
      "Best for most local businesses",
    ],
    featured: true,
    accent: "purple",
  },
  {
    id: "turbo",
    name: "Turbo",
    price: 1210,
    blurb:
      "When the market is tougher or speed matters more. Monthly strategy reviews, more SEO Time, more links, more content.",
    highlights: [
      "Monthly strategy reviews",
      "4 backlinks + 5.5 hours of SEO Time each month",
      "Best for competitive markets",
    ],
    accent: "green",
  },
];

/** Monthly add-ons (recurring). */
export const EXTRA_LOCATION = {
  label: "Extra Maps location",
  price: 60,
  note: "Each additional geographic target we concentrate map-ranking work on.",
};

export const HOSTING = {
  label: "Managed hosting",
  price: 25,
  from: true,
  note: "Fast, secure hosting on Cloudflare's edge. Updates, SSL, and uptime handled.",
};

export const MAINTENANCE = {
  label: "Website maintenance",
  price: 100,
  from: true,
  note: "Ongoing content edits, fixes, and small changes so the site never goes stale.",
};

export interface WebBuild {
  id: "build" | "build-redesign";
  name: string;
  /** One-time wholesale price in USD. */
  price: number;
  blurb: string;
  featured?: boolean;
}

export const WEB_BUILDS: WebBuild[] = [
  {
    id: "build",
    name: "Website build",
    price: 1500,
    blurb:
      "A fast, modern site built on Astro and deployed on Cloudflare, with Emdash so your client can edit content themselves. No setup fee.",
  },
  {
    id: "build-redesign",
    name: "Website + redesign-SEO",
    price: 2500,
    blurb:
      "Everything in the build, plus full redesign-SEO protection: we map every old URL, set the redirects, and preserve the rankings through launch.",
    featured: true,
  },
];

export const CURRENCY = "$";

/** Format a whole-dollar USD amount, e.g. 1210 -> "$1,210". */
export function usd(n: number): string {
  return CURRENCY + Math.round(n).toLocaleString("en-US");
}
