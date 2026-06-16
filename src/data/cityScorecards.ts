// Per-city "best SEO companies" scorecards, rendered by CityScorecard.astro at
// the foot of a city guide. ALL ENTRIES BELOW ARE ILLUSTRATIVE PLACEHOLDERS to
// prove out the format; real data (live Clutch / Ahrefs / GBP) and an editorial
// pass are required before any of this is treated as a real rating.
//
// To add a city: drop an entry keyed by the guide's slug (its filename in
// src/content/guides). The guide must be category: cities. Five signals, each
// scored 0-20, summing to the /100 total.

export interface ScoredAgency {
  name: string;
  grade: string; // A, A-, B+, B, C+, C ...
  score: number; // /100
  /** [clutch, reviews, authority, track, transparency], each /20 */
  scores: [number, number, number, number, number];
  verdict: string;
}

export interface CityScorecard {
  /** Display name of the market, e.g. "Halifax". */
  city: string;
  agencies: ScoredAgency[];
}

export const SCORECARD_SIGNALS = [
  { key: "Clutch", label: "Clutch & third-party ratings", blurb: "The closest thing the agency world has to a verified report card. The single best outside signal there is." },
  { key: "Reviews", label: "Client reviews", blurb: "Google review count and rating. Volume matters as much as the star average." },
  { key: "Authority", label: "Authority", blurb: "Backlink profile and Domain Rating (we read these in Ahrefs). Real off-site strength behind the words." },
  { key: "Track", label: "Track record & results", blurb: "Years in the market and named case studies you can actually check." },
  { key: "Transparency", label: "Transparency", blurb: "Published pricing or process, a named team, a real way to reach a human." },
] as const;

export const CITY_SCORECARDS: Record<string, CityScorecard> = {
  "halifax-seo": {
    city: "Halifax",
    agencies: [
      { name: "Harbour Search Co.", grade: "A-", score: 88, scores: [18, 19, 16, 17, 18], verdict: "Strong Clutch profile (4.9, 30+ reviews) and 120+ Google reviews, with clear published pricing. A little light on named case studies." },
      { name: "Citadel Digital", grade: "B+", score: 84, scores: [17, 17, 16, 16, 18], verdict: "Healthy backlinks and a transparent, named team. Good reviews across Clutch and Google, a notch behind on results you can verify." },
      { name: "Bluenose SEO", grade: "B", score: 80, scores: [15, 18, 14, 16, 17], verdict: "Excellent reviews and a long track record. Authority is mid-tier; would benefit from stronger links." },
      { name: "Maritime Rank", grade: "C+", score: 72, scores: [13, 15, 13, 15, 16], verdict: "A steady, capable local shop. No glaring weakness, no standout strength either." },
      { name: "Anchor Media Group", grade: "C", score: 66, scores: [12, 14, 12, 14, 14], verdict: "Generalist marketing agency where SEO is one line item. Capable, but search isn't the core focus." },
    ],
  },
  "vancouver-seo": {
    city: "Vancouver",
    agencies: [
      { name: "Pacific Peak SEO", grade: "A", score: 91, scores: [19, 19, 18, 18, 17], verdict: "Top Clutch and Google ratings, a deep backlink profile, and a decade in the market. The clear front-runner." },
      { name: "Cascadia Digital", grade: "A-", score: 87, scores: [18, 17, 18, 17, 17], verdict: "Very strong authority and well-documented case studies. Reviews are good rather than dominant." },
      { name: "Raincity Search", grade: "B+", score: 83, scores: [17, 17, 16, 16, 17], verdict: "Solid Clutch presence and transparent pricing. A dependable mid-to-upper choice." },
      { name: "Lions Gate Media", grade: "B", score: 78, scores: [15, 16, 15, 16, 16], verdict: "Broad marketing shop with a real SEO practice. Authority could be stronger for the market's competitiveness." },
      { name: "Gastown Growth", grade: "C+", score: 71, scores: [14, 15, 13, 15, 14], verdict: "Younger agency building momentum. Reviews are trending up; links and track record are still thin." },
    ],
  },
  "pittsburgh-seo": {
    city: "Pittsburgh",
    agencies: [
      { name: "Steel City SEO", grade: "A-", score: 89, scores: [18, 18, 18, 17, 18], verdict: "Balanced across every signal: strong Clutch, strong reviews, real authority, and pricing you can find without asking." },
      { name: "Three Rivers Digital", grade: "B+", score: 85, scores: [17, 17, 17, 17, 17], verdict: "Consistent performer with verifiable results. Nothing weak, nothing that leaps off the page." },
      { name: "Allegheny Search", grade: "B", score: 81, scores: [16, 17, 15, 16, 17], verdict: "Great reviews and a transparent team. Backlink profile is the area to push on." },
      { name: "Strip District Media", grade: "C+", score: 73, scores: [14, 15, 14, 15, 15], verdict: "Capable local shop, steady but unremarkable. A safe mid-market pick." },
      { name: "Mon Valley Marketing", grade: "C", score: 67, scores: [13, 14, 13, 14, 13], verdict: "Generalist agency with SEO as a side line. Fine for light needs, not a search specialist." },
    ],
  },
  "hamilton-seo": {
    city: "Hamilton",
    agencies: [
      { name: "Escarpment SEO", grade: "A-", score: 88, scores: [18, 18, 17, 17, 18], verdict: "Strong Clutch and Google reviews, transparent pricing, and a credible case-study library. Leads the local field." },
      { name: "Steeltown Digital", grade: "B+", score: 84, scores: [17, 17, 16, 17, 17], verdict: "Even, dependable scores across the board. A solid choice with a real track record." },
      { name: "Harbourfront Search", grade: "B", score: 79, scores: [15, 17, 15, 16, 16], verdict: "Excellent reviews carry it; authority and links are mid-tier for the market." },
      { name: "Dundas Media", grade: "C+", score: 72, scores: [14, 15, 14, 14, 15], verdict: "Steady neighbourhood agency. No glaring gaps, no standout strengths." },
      { name: "Mountain Brow Marketing", grade: "C", score: 65, scores: [12, 14, 13, 13, 13], verdict: "Broad marketing shop dabbling in search. Capable, but SEO isn't the focus." },
    ],
  },
};
