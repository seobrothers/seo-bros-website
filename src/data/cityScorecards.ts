// Per-city "best SEO companies" scorecards, rendered by CityScorecard.astro at
// the foot of a city guide.
//
// DATA: real, as of 2026-06. Sources per signal:
//   - Reviews  -> Google Places API (rating + review count)
//   - Authority -> Ahrefs Domain Rating
//   - Clutch / Track record / Transparency -> public research (clutch.co + each
//     firm's own site). Each signal scored 0-20.
//
// SCORING: the raw `scores` array (each /20) is the single source of truth. The
// total /100 and letter grade are COMPUTED from SIGNAL_WEIGHTS (see scoreOf /
// gradeOf below), so re-weighting a signal is a one-line change and the board
// re-ranks itself. Clutch is intentionally down-weighted to 5%: too many strong
// firms never maintain a Clutch profile for it to carry equal weight.
// DRAFT pending Devon's review before this goes live with real names.
//
// To add a city: drop an entry keyed by the guide's slug (its filename in
// src/content/guides). The guide must be category: cities.

export interface ScoredAgency {
  name: string;
  /** [clutch, reviews, authority, track, transparency], each /20. */
  scores: [number, number, number, number, number];
  verdict: string;
}

export interface CityScorecard {
  /** Display name of the market, e.g. "Halifax". */
  city: string;
  agencies: ScoredAgency[];
}

export const SCORECARD_SIGNALS = [
  { key: "Clutch", label: "Clutch & third-party ratings", blurb: "The closest thing the agency world has to a verified report card. A strong positive signal, but a weak negative one, plenty of good firms never bother with a profile." },
  { key: "Reviews", label: "Client reviews", blurb: "Google review count and rating. Volume matters as much as the star average." },
  { key: "Authority", label: "Authority", blurb: "Backlink profile and Domain Rating (we read these in Ahrefs). Real off-site strength behind the words." },
  { key: "Track", label: "Track record & results", blurb: "Years in the market and named case studies you can actually check." },
  { key: "Transparency", label: "Transparency", blurb: "Published pricing or process, a named team, a real way to reach a human." },
] as const;

// Relative weight of each signal, aligned with SCORECARD_SIGNALS. Must sum to 1.
// Equal weights (0.2 each) reproduce the original "sum the five /20 scores"
// behavior exactly. Clutch is down-weighted to 0.05; the freed weight is split
// evenly across the other four (0.2375 each).
export const SIGNAL_WEIGHTS: [number, number, number, number, number] =
  [0.05, 0.2375, 0.2375, 0.2375, 0.2375];

/** Weighted total out of 100 from the five raw /20 signal scores. */
export function scoreOf(scores: ScoredAgency["scores"]): number {
  const weighted = scores.reduce((t, s, i) => t + (s / 20) * SIGNAL_WEIGHTS[i], 0);
  return Math.round(weighted * 100);
}

/** Letter grade for a /100 total. Thresholds derived from the original data. */
export function gradeOf(score: number): string {
  return score >= 73 ? "A"
    : score >= 70 ? "A-"
    : score >= 65 ? "B+"
    : score >= 60 ? "B"
    : score >= 55 ? "B-"
    : score >= 50 ? "C+"
    : score >= 45 ? "C"
    : "D";
}

/** Agencies for a card with computed score + grade, ranked high to low. */
export function rankedAgencies(card: CityScorecard) {
  return card.agencies
    .map((a) => {
      const score = scoreOf(a.scores);
      return { ...a, score, grade: gradeOf(score) };
    })
    .sort((x, y) => y.score - x.score);
}

export const CITY_SCORECARDS: Record<string, CityScorecard> = {
  "halifax-seo": {
    city: "Halifax",
    agencies: [
      { name: "Let's Get Optimized", scores: [20, 9, 16, 18, 7], verdict: "The strongest Clutch record in the market (5.0 from 32 reviews) and a long track record since 2008, with named case studies. Thin on Google reviews and publishes no pricing." },
      { name: "Grandway Marketing", scores: [5, 17, 18, 12, 7], verdict: "A high Google rating (4.9 from 66) and the strongest authority in the set (DR 64). Held back by an empty Clutch profile and an opaque team and pricing." },
      { name: "Vandy Digital Marketing", scores: [13, 14, 9, 10, 12], verdict: "A named team and a solid 4.9 Clutch rating, but only a handful of reviews, modest authority, and a short track record (since 2022)." },
      { name: "Social Signals Marketing", scores: [9, 20, 3, 10, 8], verdict: "By far the most Google reviews (115) and the only firm to publish a price range, but near-zero domain authority and a very short history." },
      { name: "Alphasearch", scores: [5, 9, 12, 16, 4], verdict: "Two decades in business, but little to verify it: an empty Clutch profile, no named team, no published pricing, and mid authority." },
    ],
  },
  "vancouver-seo": {
    city: "Vancouver",
    agencies: [
      { name: "Salt Water Digital", scores: [5, 20, 18, 14, 12], verdict: "Tops the market on Google reviews (132 at 5.0) and authority (DR 65), with a named 14-person team. Its Clutch profile sits unused and it publishes no pricing." },
      { name: "Guaranteed SEO", scores: [9, 13, 14, 18, 12], verdict: "Nearly 30 years in the market with real case studies and a named team. Only two Clutch reviews and a slightly lower Google rating keep it off the top." },
      { name: "Evolve Branding", scores: [5, 20, 9, 16, 12], verdict: "A large named team and a huge Google review base (335), but more a branding shop than a pure SEO firm, with modest authority and an empty Clutch profile." },
      { name: "Optimized Webmedia", scores: [17, 16, 9, 14, 4], verdict: "The best-verified Clutch profile in the city (5.0 from 15 reviews) and strong Google reviews, but names no team and publishes no pricing." },
      { name: "OptiRank SEO Agency", scores: [3, 14, 9, 11, 4], verdict: "Good Google reviews, but little else to verify: no Clutch profile, no named team, no founding date, and no published pricing." },
    ],
  },
  "pittsburgh-seo": {
    city: "Pittsburgh",
    agencies: [
      { name: "Direct Online Marketing", scores: [20, 9, 16, 18, 12], verdict: "The most-reviewed firm on Clutch in the market (5.0 from 23) plus strong authority (DR 57), a named leader, and ~18 years in business. Few Google reviews and no published pricing." },
      { name: "Sixth City Marketing", scores: [9, 12, 20, 18, 12], verdict: "The strongest authority in the market (DR 73), a 20-person named team, and 18 named case studies. Held back only by thin Clutch and Google review counts." },
      { name: "Paper Box SEO", scores: [17, 11, 9, 16, 12], verdict: "The rare firm that publishes tiered pricing, backed by a solid Clutch profile and case studies with hard metrics. Lower authority and no named team." },
      { name: "Search Marketing Agency", scores: [5, 6, 20, 18, 4], verdict: "High authority (DR 71) and 20+ years with named case studies, but an unused Clutch profile, almost no Google reviews, and no named team or pricing." },
      { name: "232 Creative", scores: [5, 17, 3, 14, 12], verdict: "Strong Google reviews and a named team, but low domain authority, an empty Clutch profile, and a portfolio that leans design over SEO." },
    ],
  },
  "hamilton-seo": {
    city: "Hamilton",
    agencies: [
      { name: "SociallyInfused Media", scores: [13, 20, 18, 13, 12], verdict: "Leads the market on Google reviews (116 at 4.9) and authority (DR 63), with a Clutch profile, a named team, and ~18 years in business. Light on published case studies." },
      { name: "Massive Web Design", scores: [17, 17, 14, 13, 8], verdict: "A strong verified Clutch profile (5.0 from 14) and 25 years in business, with the second-highest authority. No named team and only partial pricing." },
      { name: "Asterisk Marketing", scores: [5, 20, 9, 14, 16], verdict: "The most transparent in the market, a named team and disclosed minimums, plus huge Google reviews (104) and real case studies. Authority and Clutch presence lag." },
      { name: "101 Keys", scores: [9, 14, 9, 14, 12], verdict: "A named team and solid Google reviews, but an unverified founding date, only one Clutch review, and modest authority." },
      { name: "Digital Envy", scores: [5, 13, 16, 14, 7], verdict: "Good authority (DR 51) and Google rating, but a conflicting company history, an empty Clutch profile, and only the CEO named." },
    ],
  },
};
