// Single source of truth for SEO Brothers' white-label rates.
//
// These are the WHOLESALE / partner prices an agency pays us. The agency marks
// them up to their own client. The /pricing/ page, the package builder
// (src/components/PackageBuilder.astro), and the web-design page all read from
// here so the numbers never drift apart. Update a price once, here.

export interface SeoTier {
  id: "self-serve" | "managed" | "custom";
  name: string;
  /** Monthly wholesale price in USD. */
  price: number;
  /** Render as a floor ("from $1,000+") instead of a fixed monthly rate. */
  from?: boolean;
  /** One-line answer to "who does the work". Sits directly under the name. */
  who: string;
  blurb: string;
  highlights: string[];
  /**
   * Where this tier's button goes. Self-Serve and Managed both enter through
   * the free account at /sign-up/: the partner signs up, runs a discovery, and
   * decides from inside whether to drive it or hand it to us. Only Custom needs
   * a human up front, because it has to be scoped before there is a price.
   */
  cta: { label: string; href: string };
  featured?: boolean;
  accent: "teal" | "purple" | "green";
}

export const SEO_TIERS: SeoTier[] = [
  {
    id: "self-serve",
    name: "Self-Serve",
    price: 174,
    who: "You run it.",
    blurb:
      "Full access to Tideworthy with the campaign agents doing the heavy lifting. You set the direction and own the hours. We are on support when you need us.",
    highlights: [
      "Tideworthy platform + campaign agents",
      "Support included, you own the hours",
      "Best for partners with in-house capacity",
    ],
    cta: { label: "Start for free", href: "/sign-up/" },
    accent: "teal",
  },
  {
    id: "managed",
    name: "Managed",
    price: 600,
    who: "We run it, under your brand.",
    blurb:
      "Our most-quoted package and where most partners land. Our team runs the campaign inside Tideworthy under your brand, so you sell the outcome and never touch the work.",
    highlights: [
      "Quarterly strategy + monthly content",
      "2 backlinks + 3 hours of SEO Time each month",
      "True white label, our name nowhere",
    ],
    cta: { label: "Start for free", href: "/sign-up/" },
    featured: true,
    accent: "purple",
  },
  {
    id: "custom",
    name: "Custom",
    price: 1000,
    from: true,
    who: "We scope it.",
    blurb:
      "For the messy and the complex: migrations, multi-location rollouts, franchise systems, and competitive markets where the card prices will not move the needle.",
    highlights: [
      "Scoped in your free discovery",
      "Multi-location, franchise, and migration work",
      "Volume and low-competition rates quoted here too",
    ],
    cta: { label: "Book a growth call", href: "/book-a-growth-call/" },
    accent: "green",
  },
];

/** Monthly add-ons (recurring). */
export const EXTRA_LOCATION = {
  label: "Location work",
  price: 60,
  note: "Per location, about an hour a month each: GBP updates, citation building, and local landing-page reviews.",
};

export const GBP_POSTING = {
  label: "GBP posting",
  price: 50,
  note: "Google Business Profile posting across the whole campaign, any number of locations. Highly recommended for local SEO.",
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

export const EXTRA_BLOG = {
  label: "Content (blog post)",
  price: 120,
  note: "An optimized blog post or content piece each month.",
};

export const EXTRA_HOUR = {
  label: "Extra SEO Time",
  price: 60,
  note: "More specialist hours per month aimed at the priority work that moves rankings.",
};

// Line items for the à-la-carte package builder (src/components/PackageBuilder.astro).
// Rates: SEO Time $60/hr (EXTRA_HOUR), content $120 (EXTRA_BLOG), backlinks $60.
//
// Every managed campaign includes a fixed base: reporting + a health/crawl score.
// These are required by default (only dropped if a partner negotiates, e.g. they
// run their own reporting), so the builder shows them as included, not toggleable.
export const REPORTING = {
  label: "Reporting dashboard",
  price: 50,
  note: "Live reporting in our Portal: what's next, what we're working on, and a work log of everything done. Show your client under your brand, or keep it internal.",
};
export const HEALTH = {
  label: "Health & crawl score",
  price: 50,
  note: "Monthly health and crawl-score check that catches and fixes errors. Proactive technical work like page speed lives in SEO initiatives.",
};
/** Always-included managed-campaign base. Sums to $100/mo. */
export const MANAGED_INCLUDED = [REPORTING, HEALTH];
export const MANAGED_BASE_TOTAL = MANAGED_INCLUDED.reduce((s, i) => s + i.price, 0);

export const BACKLINK = {
  label: "Backlinks",
  price: 60,
  note: "Editorial links built each month from our publishing network.",
};

// Strategy reviews are billed per review ($300), so the chosen cadence sets the
// monthly cost: semi-annual = $50/mo, quarterly = $100/mo, monthly = $300/mo.
export const STRATEGY = {
  label: "Strategy reviews",
  pricePerReview: 300,
  note: "A working session to set priorities and review performance, billed per review.",
  cadences: [
    { id: "semi", label: "Semi-annual", perYear: 2 },
    { id: "quarterly", label: "Quarterly", perYear: 4 },
    { id: "monthly", label: "Monthly", perYear: 12 },
  ],
};

/** Monthly cost of a strategy cadence (perYear reviews x $300 / 12). */
export function strategyMonthly(perYear: number): number {
  return Math.round((STRATEGY.pricePerReview * perYear) / 12);
}

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
      "A fast, modern site built on Astro and deployed on Cloudflare, and easy for your client to edit themselves. No setup fee.",
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
