# White-Label SEO Restructure — Plan

_Last updated: 2026-06-15. Working doc; update as we go._

## Goal

Split the 3,872-line `/white-label-seo/` sales monolith into two purpose-built
pages, each pointed at the term it can actually win, and consolidate out of the
`/white-label-seo/` folder we suspect is being suppressed.

## Keyword data (Google US, Ahrefs)

| Keyword | Volume | Difficulty | Traffic Potential |
|---|---:|---:|---:|
| white label seo | 5,600 | 5 | 3,700 |
| white label seo services | 3,400 | 6 | 3,700 |
| white label link building | 3,300 | 2 | 800 |
| outsource seo | 1,700 | 5 | 800 |
| white label local seo | 1,600 | 3 | 2,900 |
| white label seo reseller | 1,500 | 23 | 8,800 |
| seo reseller | 1,100 | 6 | 9,300 |
| outsourced seo | 800 | 9 | 1,600 |
| outsource seo services | 500 | 11 | 1,600 |
| enterprise seo (end-client, not us) | 2,100 | 24 | 8,600 |
| white label ai seo | 50 | 0 | 0 |
| white label enterprise seo | 80 | 12 | 150 |
| white label ecommerce seo | 80 | 1 | 30 |

Note: broad `ecommerce seo` (12k) / `shopify seo` (5.6k) / `enterprise seo` (2.1k)
are end-client terms, wrong audience for a white-label (agency) buyer, so we do
not chase them. Ecommerce/enterprise stay as **conversion** content (high deal
value), not traffic targets.

## Final architecture

| Page | URL | Head term(s) | Role | Status |
|---|---|---|---|---|
| Sales / money page | `/white-label-seo-services/` (new) | white label seo services (3,400) + outsource seo (1,700) | Commercial, conversion | BUILD |
| White-label guide | `/guides/white-label-seo/` (new) | white label seo (5,600) + reseller terms | Comparison-led, educational | BUILD |
| Old hub | `/white-label-seo/` | — | **404** (has ~zero inbound links, sheds suspected suppression) | REMOVE |
| Spokes | `/white-label-seo/{ai-seo,ecommerce,enterprise,link-building,local}/` | — | **404 / fold** (see below) | REMOVE |
| Pricing | `/pricing/` | white label seo pricing | 🔒 **Do not touch** | KEEP |
| WL web design | `/white-label-web-design/` | — | Cross-sell partner | KEEP |

## The white-label taxonomy (guide centerpiece)

A spectrum of how much of the work you keep vs. hand over:

1. **Fulfilment desk (raw execution)** — you bring strategy + sales; they execute
   à-la-carte deliverables. _The HOTH, E2M Solutions, Boostability, SEOReseller._
2. **Managed campaigns (strategy-light)** — they own per-client strategy +
   execution, stay invisible, but you sell it and train your own team. _Most
   "white label SEO agencies."_
3. **Strategic partner (SEO Brothers)** — strategy + execution **plus** sales
   support (pitch help, joining client calls) and team training, wrapped in
   transparent, collaborative reporting. You own brand, relationship, pricing.

Honest positioning line: _"If you already have an SEO strategist and just want
hands, we're not the cheapest fulfilment desk and we won't pretend to be. If you
want a partner who helps you sell, deliver, and grow, that's the entire point of
us."_

### Competitor tiering (research-verified 2026-06-15)

| Provider | Tier | Notes / accuracy flags |
|---|---|---|
| The HOTH | 1 (fulfilment, à-la-carte) | order individual deliverables off a menu. Reseller path is fulfilment-only. Optional HOTH X managed upsell ($1k–$10k/mo). |
| SEOReseller | 1 (fulfilment, à-la-carte, tooling-rich) | productized fulfilment + Proposal Builder tooling. Do NOT claim they join calls. |
| E2M Solutions | 1 (fulfilment, hourly/dedicated-team) | **Reclassified to Tier 1 per Devon's direct convo with their owner (2026-06-15): straight hourly "tell us what you need" — agency brings strategy, they supply hours.** Their site copy claiming strategy ownership is contradicted; don't assert it. |
| Semify | 2 (managed) | tailored strategy + account manager; no advertised sales support/training. Don't name platform "ROIClout". Pricing quote-only. |
| Boostability | **3 (partner)** | verifiably joins sales calls (claims 30% close), team training, LaunchPad platform. Cheap ($480/mo retail). **This is why we can't claim uniqueness.** |
| That! Company | 3 (partner) | joins calls + proposals; training weak/unverified. Pricing quote-only. |

> Accuracy flags from research must be honored — do not publish unverified claims
> (Semify/SEOReseller joining calls; That!/Semify pricing; Semify platform name).

### Differentiating WITHIN Tier 3 (vs Boostability / That! Company)

We are NOT "the only one who partners on sales + training." The honest, defensible
edge (confirmed by Devon 2026-06-15):

- **Collaborative partner portal** (not Dasher — Dasher is dentists-only WIP, downplay):
  real-time comms, notifications, updates, newsletters, transparency into the work,
  and client-facing **approvals/feedback under the partner's OWN domain via CNAME**.
  Boostability's LaunchPad is reporting; ours is collaboration + white-labeled client
  approval workflow.
- **Any budget, proven both ways:** 100+ onboards/mo for a vet group (scaled ~300/mo)
  AND many $5K, some $10K/mo campaigns incl. publicly traded companies. Versatile from
  tiny to enterprise vs. a low-cost-volume machine.
- **Co-built productized service per partner/niche:** bread and butter. Reviews the
  partner's whole PORTFOLIO, not single campaigns in isolation. Bespoke vs. templated.

Positioning line: _"Plenty of shops fulfil. A few will even join your sales calls. The
difference is whether you get a templated machine or a transparent, technical team that
builds you a custom productized service and software-grade client collaboration."_

## Section migration map (from the 3,872-line hub)

| # | Existing section | Destination |
|---|---|---|
| 1 | Hero | Sales (new commercial hero) |
| 2 | What Is White Label SEO | Guide |
| 3 | Specialties (hub→spokes) | Drop (spokes going away) |
| 4 | Reseller vs Provider | Guide |
| 5 | Why agencies use WL SEO | Sales (benefits) + light version in guide |
| 6 | Mid-page CTA | Sales |
| 7 | Proven process | Sales |
| 8 | Competitive approach | Guide (becomes the taxonomy + competitor table) |
| 9 | Campaign components | Sales (what's included) |
| 10 | Action items / "SEO time in plain terms" | Guide (educational) |
| 11 | Partner portal (Dasher reporting) | Sales |
| 12 | Popular products | Sales |
| 13 | Pricing (links to /pricing/) | CTA to /pricing/ on both pages |
| 14 | WL vs reseller | Guide |
| 15 | How to choose a provider | Guide |
| 16 | Common pitfalls | Guide |
| 17 | Website bundle | Sales (cross-sell /white-label-web-design/) |
| 18 | Testimonials | Sales (+ light proof in guide) |
| 19 | FAQ | Split by intent across both |

### Ecommerce / enterprise / ai (folded, not standalone)

- Ecommerce + enterprise → capability sections on the **sales** page ("we handle
  ecommerce and enterprise clients"). High deal value, ~zero search demand.
- AI SEO → brief mention; no dedicated page (50 vol, TP 0).
- Link building (3,300, KD 2) + local (1,600, KD 3) → real demand; cover as
  **guide** sections (or later as their own guide entries if we want the pages).

## Build stages

- [ ] **1. Guide** — new `/guides/white-label-seo/` content-collection entry,
      `category: agency`. Taxonomy + competitor table + reseller-vs-provider +
      how-to-choose + pitfalls + FAQ. Targets "white label seo." Joins the
      existing WL agency-guide cluster (white-label-seo-audits,
      white-label-seo-reporting, how-to-sell-seo-services).
- [ ] **2. Sales page** — new `/white-label-seo-services/.astro`. Reuse hero,
      benefits, process, components, portal, products, website bundle,
      testimonials, ecommerce/enterprise capability sections. Targets "white
      label seo services" + "outsource seo." CTAs → /pricing/ and partner flow.
- [ ] **3. Redirects / 404** — remove `/white-label-seo/` + the 5 spokes (404).
      Update sitemap (`src/pages/sitemap.xml.ts`). Decide later whether to 301
      the old hub into the guide once the guide proves out.
- [ ] **4. Internal links** — update nav, footer, guides hub (Agency Guides),
      and any in-content links pointing at old `/white-label-seo/` URLs.
- [ ] **5. QA** — build, check links, confirm /pricing/ untouched, confirm
      sitemap correct.

## Open / later

- 301 vs leave-404 on old hub once guide ranks (currently: 404 now, observe).
- Whether link-building / local get their own guide entries vs. guide sections.
- Style: follow STYLE_GUIDE.md (Adam vs Devon voice, byline rules). No em dashes.
