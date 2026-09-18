// The add-on and website rates SEO Brothers quotes beside the plans.
//
// These are the WHOLESALE / partner prices an agency pays us. The agency marks
// them up to their own client. The plans themselves (Tiny / Typical / Turbo)
// come from the platform's public price list (src/data/platform-pricing.ts)
// and are never written here. The /pricing/ page and the web-design page
// read these so the numbers never drift apart. Update a price once, here.

/** Monthly add-ons (recurring). */
export const EXTRA_LOCATION = {
  label: "Location work",
  price: 50,
  note: "Per additional location each month: GBP updates, citation building, and local landing-page reviews.",
};

export const GBP_POSTING = {
  label: "GBP posting",
  price: 50,
  note: "Google Business Profile posting across the whole campaign, any number of locations. Highly recommended for local SEO.",
};

export const HOSTING = {
  label: "Managed hosting",
  /** Billed per year. */
  price: 25,
  period: "year" as const,
  note: "Fast, secure hosting on Cloudflare's edge for websites we build. Updates, SSL, and uptime handled.",
};

export const MAINTENANCE = {
  label: "Website maintenance",
  price: 25,
  note: "Ongoing content edits, fixes, and small changes on websites we build, so the site never goes stale.",
};

export const EXTRA_BLOG = {
  label: "Content (blog post)",
  price: 29,
  note: "An optimized blog post or content piece each month.",
};

export const EXTRA_HOUR = {
  label: "Human SEO Time",
  price: 75,
  note: "Specialist time for ad-hoc scope and projects outside the campaign: a migration, a one-off audit, a build-out the plan does not cover. Billed per hour.",
};

// Every managed campaign includes a fixed base: reporting + a health/crawl
// score, shown on the rate card as included.
export const REPORTING = {
  label: "Reporting dashboard",
  price: 25,
  note: "Live reporting in our Portal: what's next, what we're working on, and a work log of everything done. Show your client under your brand, or keep it internal.",
};
export const HEALTH = {
  label: "Health & crawl score",
  price: 25,
  note: "Monthly health and crawl-score check that catches and fixes errors. Proactive technical work like page speed lives in SEO initiatives.",
};
export const BACKLINK = {
  label: "Backlinks",
  price: 50,
  note: "Editorial links built each month from our publishing network.",
};

// Strategy reviews are billed per review ($300), so the chosen cadence sets the
// monthly cost: semi-annual = $50/mo, quarterly = $100/mo, monthly = $300/mo.
export const STRATEGY = {
  label: "Human Strategy Reviews",
  pricePerReview: 300,
  note: "A working session with a strategist to set priorities and review performance, billed per review.",
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
    price: 99,
    blurb:
      "A fast, modern site built on Astro and deployed on Cloudflare, and easy for your client to edit themselves. No setup fee.",
  },
  {
    id: "build-redesign",
    name: "Website + redesign-SEO",
    price: 999,
    blurb:
      "Everything in the build, plus full redesign-SEO protection: we map every old URL, set the redirects, and preserve the rankings through launch.",
    featured: true,
  },
];

export const CURRENCY = "$";

/** CAD shown at a fixed multiple of the USD list price (the pricing page toggle). */
export const CAD_RATE = 1.4;

/** Format a whole-dollar USD amount, e.g. 1210 -> "$1,210". */
export function usd(n: number): string {
  return CURRENCY + Math.round(n).toLocaleString("en-US");
}
