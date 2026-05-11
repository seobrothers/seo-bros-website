# Website Wishlist

Things we want on seobrothers.com eventually but aren't ready to ship yet. Add to this list as ideas come up; promote items into actual tasks when the supporting work (recording, copy, asset, etc.) is ready.

## Video / media

- **3-min explainer video on `/white-label-seo`.** Single short video answering "what's it like to partner with SEO Brothers." Drop into the page once recorded. The longer "how Portal works day-to-day" walkthrough belongs in the email nurture series and inside Portal as new-partner reference material, not on the marketing site.

## Brand assets

- **RocketBarn logo.** Devon has the new wordmark (ROCKETBARN orange + Franchisee-First Local Marketing tagline navy). Pending: stable file path so we can strip the white background and replace `public/images/logo-rocketbarn.png`. Open visual question once installed: bright orange will stand out against the gray-toned TrustBar neighbors. Decide whether to keep brand colors or desaturate for visual consistency.

## Forms / conversion

- **Newsletter opt-in widget.** Two checkboxes: Monthly SEO Updates (pre-checked) and Portal Updates (unchecked). Wire to Bento (we're migrating off ActiveCampaign as of 2026-05-05). Place mid-page on `/white-label-seo` as a low-commitment nurture for hesitant agency buyers.
- **"Prefer to chat first?" link on `/sign-up`.** Reserved space exists in the layout. Wire it to a 30-min Calendly when we want to test giving prospects a non-form path before committing to Portal onboarding. Mike + Adam to decide when to test.
- **GA4 + Google Ads conversion tracking.** Form submit at `/sign-up` (POST to `portal.seobrothers.com/onboard`) should be a conversion event in Google Ads so the algo can optimize. Coordinate with Colin on whether tracking fires from the marketing site (before navigation) or from Portal (after submit lands).

## Paid traffic

- **No-index `/outsource-seo` PPC mirror.** Adam's idea. If `/white-label-seo` Quality Score doesn't recover after 4 weeks of the new "Outsourced SEO for growth-focused agencies" subhead + paused `[white label digital marketing]` keyword, build a no-index page tuned aggressively for paid intent (outsource framing, direct-response CTA copy, agency-type signals). Decouples PPC messaging from organic without diluting either.

## Content / pages

- **Partner agency type framing.** "Trusted by digital marketing, web design, and creative agencies" framing somewhere prominent on `/white-label-seo` if we keep running ads on the `[white label digital marketing]` keyword (otherwise pause that keyword).
- **Partner logo bar above the fold.** TrustBar already exists on the homepage; consider porting to `/white-label-seo` once we have permission to feature current partners.
- **Decide what to do with `/acquires-smart-web-solutions/`.** The page exists in `src/pages/` but has no inbound links from Nav, Footer, or anywhere else (orphan). Options: (1) link it from About or a new `/news/` index, (2) `noindex` it via the new `noindex` prop on Layout if it's archival, or (3) delete it. Slug also breaks our convention (verbs in slugs).
- **Brand refresh of social profiles before linking from new site.** Footer now links to LinkedIn / YouTube / Facebook, but those profiles are outdated and need a refresh for consistency with the new site identity. Coordinate with whoever owns brand.

## Deferred industry guides

These were drafted but pulled from launch on 2026-05-10 because the underlying scaffold (Search behavior → Keyword strategy → Content topics → Local SEO → Common mistakes) was reused across guides and the per-vertical specificity was thin. Each is still on disk with `draft: true` in frontmatter; flip to `false` once you've rewritten with real Workbench/Ahrefs keyword data and at least one named-client example. The notes below are the starting point for each rewrite.

- **`/guides/dental-seo/`** — Heavily templated. Bring back with a real dental practice case study, named GBP category breakdown, and the per-insurance-plan content angle worked out as actual page recipes (Delta, Cigna, Aetna, MetLife). The emergency-as-its-own-funnel framing is strong but needs proof.
- **`/guides/hvac-seo/`** — Pure template. Bring back with seasonal-volume data (real Ahrefs/Search Console pulls on summer vs winter swing keywords), refrigerant rule + federal tax credit freshness as recurring content cadence, and at least one named HVAC-partner result.
- **`/guides/auto-repair-seo/`** — Matrix framing (service × make × city) is the right angle but undersold. Bring back with a real fleet vs consumer split walkthrough, named symptom-page examples, and call-tracking conversion data.
- **`/guides/carpet-cleaning-seo/`** — Mostly scaffold. The stain-type content idea and end-of-tenancy seasonal spike are the only differentiators; bring back with a real cleaning-co case study and per-stain landing page recipes.
- **`/guides/funeral-home-seo/`** — Sensitive vertical with thoughtful tone notes already in place. Defer until SEO Brothers is actively prospecting this vertical; the FTC Funeral Rule and pre-need vs at-need split are good bones for the rewrite.
- **`/guides/tree-service-seo/`** — Adam-authored, tactical but template-shaped. Rework with Adam: real storm-driven emergency-spike data, the seasonal-arc structure he started, and click-share stats updated to current SERP layout.
- **`/guides/home-builder-seo/`** — Decent differentiation (long sales cycle, plan-gallery architecture, NAHB/HBA link layer) but adjacent to home-services. Bring back when there's a builder-specific case study or when home-builder is a deliberate target vertical.
- **`/guides/medspa-seo/`** — Solid template treatment with brand-name treatment angle (Botox/Dysport/Jeuveau separately). Bring back with a real injectables-clinic example, manufacturer-copy plagiarism warnings made concrete, and RealSelf/Groupon aggregator pressure substantiated.
- **`/guides/orthodontist-seo/`** — Sits next to dental-seo with similar shape. Consider consolidating into a single dental + orthodontic pillar, or bring back when there's an Invisalign-vs-traditional content split worth its own page.
- **`/guides/audiology-seo/`** — OTC hearing aid (FDA Oct 2022) is the real angle; older-demographic search behavior and brand-keyword universes (Phonak/Oticon/ReSound) are good bones. Bring back when audiology becomes a deliberate vertical for SEOB.
- **`/guides/acupuncture-seo/`** — Condition-first framing ("patients search for back pain, not acupuncture") is the right angle but doesn't carry the page on its own. Defer until SEOB has acupuncture experience to draw on.
