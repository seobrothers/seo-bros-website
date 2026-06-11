---
title: "Website Redesign SEO: A Nine-Step Process to Preserve Rankings Through a Migration"
category: seo
publishDate: 2026-04-30
updatedDate: 2026-05-06
author: "Adam Bate"
summary: Most websites lose organic traffic after a redesign because the SEO work was an afterthought. The nine-step process for shipping a redesign that holds rankings, plus the specific traps (staging robots.txt, redirect mapping, template regressions) that cause the worst losses.
featured: false
---

A website redesign is the moment a business is most likely to lose organic traffic in a single week. We've audited dozens of post-redesign sites where the launch knocked organic visits down 40 to 70 percent, and the cause is almost always the same: SEO work happened too late, redirects were mapped blindly, the staging environment leaked into the index, or templates regressed page elements that were quietly carrying ranking signal.

A redesign is also one of the highest-leverage moments in SEO. Every page is being touched and every template rewritten, and decisions made now compound for years. Done well, a redesign improves both the user experience and the organic baseline.

This is the nine-step process we run on every redesign engagement.

## When to start

The highest-leverage decision in redesign SEO is starting early. SEO work that begins after wireframes are approved is already late. Work that begins after the staging build is functional is salvage.

The right entry point is the first design brief. The SEO lead should be in the room when navigation, URL structure, template philosophy, and content scope decisions are being made. Every one of those decisions has ranking implications, and each is more expensive to fix after the fact.

If the project is already past that point, start now anyway. The remaining steps still apply, the cost just goes up.

## Step 1: Get access to everything

Before any audit work, secure access to GA4 (12+ months of page-level data), Search Console, the CMS and hosting (production and staging), a crawler (Screaming Frog or Sitebulb), and a rank tracker with historical data. Server logs where accessible. Without these, the audit produces opinions, not evidence.

## Step 2: Audit the existing site

This is the step that prevents the worst redesign disasters. The goal is to understand exactly what's working on the current site, page by page, before any of it gets touched.

What the audit produces:

- **A ranked list of pages by organic value.** Sessions, conversions, ranked keywords, and backlinks per URL. The top 20 percent of pages usually drive 80 percent of the outcome and get the most protection.
- **A keyword-to-URL map for the current site.** The baseline against which post-launch performance is measured.
- **A backlink profile by URL.** Pages with strong link equity need redirects to the closest new equivalent, no exceptions.
- **An on-page element inventory.** Title tags, H1s, meta descriptions, internal linking, schema, alt text, content length.
- **A technical baseline.** Core Web Vitals (LCP, INP, CLS), indexation, sitemap coverage, robots.txt, canonicals, hreflang where applicable.

If the design team doesn't know which pages are doing the work, the redesign will route around them.

For the deeper audit framework, see [our SEO audit guide](/guides/seo-audit/).

## Step 3: Brief the design and development team

The audit's findings have to translate into design constraints. The brief covers:

- **Pages that must not change structurally.** Top-performing pages, with specifics on content depth, internal linking, schema, and headers.
- **URL structure preservation.** Where existing URLs are clean and ranking, they carry over unchanged. Vanity URL changes for redesign aesthetics destroy rankings.
- **Template requirements.** Each template needs SEO requirements baked in: H1 placement, breadcrumbs, internal linking modules, schema, image handling.
- **Content scope.** Which pages are being rewritten versus migrated, and where new content needs to be produced before launch.
- **Performance budget.** Core Web Vitals targets the new site must meet: LCP under 2.5s, INP under 200ms, CLS under 0.1.

The brief is the contract between the SEO and design workstreams.

## Step 4: Industry and keyword research

The redesign is also an opportunity to expand the keyword footprint. Fresh research surfaces opportunities the current site doesn't address.

- **Competitor gap analysis.** What are the top three competitors ranking for that the current site isn't?
- **AI overview behavior.** For high-value queries, what does Google's AI overview surface, and which sources is it citing? Content should be structured to be citation-eligible.
- **New content clusters.** Topics adjacent to current rankings where content depth would unlock additional traffic.
- **Helpful Content alignment.** A redesign is a chance to consolidate or remove thin pages dragging the site down.

Methodology is in [our keyword research guide](/guides/keyword-research/).

## Step 5: Build the keyword mapping document

Every URL on the new site gets mapped to a primary keyword target, with secondary keywords noted, before content production starts. The mapping draws from both the old-site audit and the new research.

The mapping document specifies new URL, primary keyword and intent, secondary keywords, old URL it replaces, content brief (H1, summary, sections, internal links, schema), and owner and deadline.

A well-maintained keyword map prevents two things that derail redesigns: keyword cannibalization (multiple pages targeting the same query) and orphaned high-value queries (existing rankings with no clear page to inherit them).

The framework is in [our keyword mapping guide](/guides/keyword-mapping/).

## Step 6: Map the 301 redirects

This is the most critical technical task in any redesign. Every URL on the old site with any value (ranking, traffic, backlinks, internal linking) needs a 301 redirect to its closest equivalent on the new site.

The mistakes that cause the most damage:

- **Mass redirects to the homepage.** "We'll just redirect everything to the homepage" loses the topical relevance signal that made each old URL rank. The closest topical match is the right target.
- **Mapping before the new site is built.** Mapping has to happen once the new URL structure is finalized and verified against the actual new pages.
- **Skipping the long tail.** Backlinks land on long-tail pages, and 404s degrade overall quality signals. Don't redirect only the top 100 URLs.
- **Not testing the redirects.** Every redirect in the map gets tested before launch. Screaming Frog can crawl the old URL list and verify each returns 301 to the expected new URL.
- **Chained redirects.** Chains (URL A to URL B to URL C) lose ranking signal. Redirect old URLs directly to final new URLs.

The redirect map is the document that determines whether the redesign holds rankings.

## Step 7: Implement and pre-launch QA

Before launch, the staging site goes through a full SEO QA pass. Screaming Frog crawls the staging build and the output is checked against the keyword map, the redirect map, and the template requirements.

What the QA covers:

- **Indexation directives.** Staging robots.txt and meta robots tags. The most damaging post-launch error is leaving a `Disallow: /` from staging in production.
- **Canonical tags.** Each page canonicalizes to itself unless deliberately pointing elsewhere. Cross-domain canonicals to the staging domain are a launch-day footgun.
- **Schema markup.** Validates against Google's Rich Results Test for every template type.
- **Internal linking.** No broken links, navigation matches the keyword map, breadcrumbs render correctly.
- **Page-level elements.** Title tags, meta descriptions, and H1s match the keyword map.
- **Core Web Vitals.** Tested against the performance budget on actual pages, not just the home page.
- **Hreflang.** Where applicable, tags reference live URLs and reciprocate correctly.

## Step 8: Launch and the post-launch audit

Launch day is half the battle. The post-launch audit, in the first 48 hours and again at the two-week and four-week marks, is what catches the issues that slipped through.

Within 48 hours of launch: crawl the live site and compare against the staging crawl, verify robots.txt is the production version (not the staging one), verify the XML sitemap is live and submitted to Search Console, spot-check 50 high-value redirects manually, and confirm GA4 and Search Console are tracking the new site correctly.

Two weeks post-launch: indexation check in Search Console (are new URLs being indexed, old URLs being deindexed via the 301 chain), coverage report for 404s or redirect errors, Core Web Vitals field metrics.

Four weeks post-launch: ranking comparison against the pre-launch baseline, traffic comparison year-over-year and week-over-week, conversion rate against the old site.

Wait roughly a month before drawing conclusions. Search behavior is noisy in the first three weeks after a major migration, and reactive changes during that window often cause more harm than the underlying issue would have.

## Step 9: Plan the next phase

A redesign is the start of an optimization phase, not the end of one. Use the data and new architecture to plan the next 6 to 12 months: a content calendar mapped to keyword opportunities, internal linking improvements as new content lands, continued backlink building, quarterly Core Web Vitals reviews, and E-E-A-T improvements (author bios, schema, expertise signals) across the content layer.

For the link side, see [our link building guide](/guides/link-building/).

## The traps that cause the worst losses

Three failure modes account for most disastrous redesign outcomes:

**The staging robots.txt leak.** A site launches with `Disallow: /` still in robots.txt because nobody changed it from staging. The site disappears from the index in three days. The most preventable redesign disaster, and we still see it once or twice a year.

**Blind redirect mapping.** Redirects mapped from a spreadsheet without verifying the new target page exists or is topically relevant. Every wrong redirect is a quietly lost ranking.

**Template regressions on high-value pages.** A new service-page template that drops the H1, removes FAQ schema, or thins body content from 1,800 words to 400. The template is "cleaner" and rankings collapse.

All three are catchable with the audit and QA discipline above.

## Putting it together

The redesign that holds rankings starts before visual design begins, audits the current site exhaustively, briefs design and development with SEO constraints baked in, maps redirects against a real new URL structure, QAs the staging environment before launch, and audits the live site for the first month after.

If you've got a client heading into a redesign or recovering from one that didn't go well, [get in touch](/tools/free-seo-audit/) and we'll work through where the migration is leaking ranking signal. And if you'd rather hand the whole rebuild off, we run [white-label web design and development](/white-label-web-design/) for agencies, with this redirect-and-visibility protection baked into the redesign tier.
