---
title: "SEO Audit: How We Run Them, What's In Them, and How to Deliver Findings"
category: seo
publishDate: 2026-04-30
summary: A practical guide to running an SEO audit. The performance review, technical audit, and content audit components, the tools we use, the deliverable formats that drive client action, and the audit-as-prospecting versus audit-as-paid-service decision.
featured: true
---

An SEO audit is the diagnostic step that makes everything else legible. Without one, you're optimizing in the dark. With one, the order of operations and the priority work become obvious.

This guide covers the audit framework we use across client and partner-agency engagements: what's in a complete audit, the tools we run, how the deliverable gets packaged, and the strategic decision about whether audits should be a free prospecting tool or a billable service.

## What an SEO audit actually does

An audit answers four questions:

1. Where does the site stand in organic search today?
2. What's preventing it from ranking better?
3. Which fixes will move the needle most?
4. In what order should the work happen?

The output isn't a list of every issue. It's a prioritized roadmap that maps findings to actions, with rough effort and impact estimates. A 40-page audit document that a client can't act on is worth less than a 10-page audit that gets implemented.

Time investment: anywhere from an hour to a full day of work, depending on the depth of the audit and the size of the site. Free prospecting audits skew toward the lighter end. Paid audits or pre-engagement diagnostics for substantial campaigns warrant the full day.

## The three audit components

A complete audit has three sections. Skip any of them and the picture is incomplete.

### 1. Performance review

The snapshot of where the site stands in organic search today. This is the baseline against which everything else is measured.

**What to pull:**

- **Organic traffic.** Month-over-month, year-over-year, percentage of total site traffic. Trend matters as much as absolute numbers.
- **Top landing pages.** Which pages currently get organic traffic, and what's the conversion behavior on each.
- **Keyword rankings.** Current visibility across mixed-difficulty keywords, branded and non-branded breakdown, ranking distribution.
- **Domain authority signals.** Moz Domain Authority, Majestic Trust Flow and Citation Flow, do-follow versus no-follow link profile.
- **Link profile health.** Anchor text distribution, link types, any obvious risk signals (spam links, link velocity anomalies, suspicious patterns).

**Tools used:**

- Google Analytics 4 for traffic and conversion data
- Google Search Console for query, page, and impression data
- Ahrefs, SEMrush, or Moz for keyword rankings and link profile
- Majestic for trust flow and link profile depth

The performance review is the easiest section to compile and the highest-value section for the client. It tells them where they are.

### 2. Technical SEO audit

The diagnostic on whether the site can be properly crawled, indexed, and rendered. Issues in this section often produce dramatic improvements when fixed.

**Categories to examine:**

- **Robots.txt.** Verify nothing important is blocked. Common failure: a staging-environment robots.txt accidentally promoted to production.
- **XML sitemaps.** Confirm they exist, they're submitted to Search Console, they include the right URLs, and they don't include redirected, broken, or no-indexed pages.
- **Indexation.** Compare the sitemap URLs to actually-indexed URLs. The gap usually surfaces real problems: thin content being filtered, duplicate content collapsing, or no-index tags applied to pages that should be indexed.
- **Page speed and Core Web Vitals.** LCP, INP, CLS for major page templates. Conversion data is sensitive to speed: roughly a 7% conversion-rate drop for every additional second of load time, depending on the source you trust.
- **404 errors and redirect chains.** Broken links lose link equity. Long redirect chains slow the site and waste crawl budget.
- **URL structure.** Does the URL hierarchy reflect the content hierarchy? Are URLs clean and descriptive? Any URL parameter issues creating duplicate content?
- **Internal linking.** Breadcrumb structure, cross-linking within content silos, orphan pages with no internal links.
- **Mobile responsiveness.** Pass/fail on Google's Mobile-Friendly Test, plus a manual review of key page templates on mobile.
- **HTTPS and security.** Active SSL certificate, no mixed-content issues, proper HTTP-to-HTTPS redirects.
- **Schema markup.** What schema is present, what should be present, validation results from Google's Rich Results Test.
- **Canonical tags.** Are they present, correct, and pointing where they should?

**Tools:**

- Screaming Frog or Sitebulb for the full crawl
- Google Search Console for indexation, mobile, and Core Web Vitals data
- Google PageSpeed Insights, GTmetrix, or WebPageTest for speed details
- Google Rich Results Test for schema validation
- Google Mobile-Friendly Test for mobile pass/fail

The technical audit is where the unsexy but high-impact wins live. Fixing a robots.txt issue or correcting a botched canonical setup can produce ranking lifts that link-building campaigns can't.

### 3. Content audit

The on-page and content-strategy diagnostic. This is where the most labor-intensive findings live, and where the recommendations have the longest implementation timelines.

**On-page elements to review:**

- **Page titles.** Keyword inclusion, length within character limits, uniqueness across pages, template bloat (sites where every title ends with the same 30-character brand suffix waste prime title-tag real estate).
- **Meta descriptions.** Present, unique, action-oriented, keyword-aware. Note for the record: meta keywords are dead. Stop using them.
- **Heading hierarchy.** Single H1 per page, sensible H2/H3 structure, keyword variations placed appropriately, no header skipping.
- **Body content quality.** Word count adequacy for the topic, content depth, original writing versus boilerplate or scraped content.
- **Duplicate content.** Across pages on the same site, between subdomains, or copied from other sites. Use Copyscape for cross-site duplication checks.
- **Thin content.** Pages with insufficient depth to rank. Tag pages, archive pages, near-empty service pages.
- **Rich media.** Image alt text, image filenames, video markup, alt-text keyword stuffing.

**Content strategy review:**

- Coverage gaps (queries the site should rank for but has no relevant page)
- Cannibalization (multiple pages targeting the same query, splitting authority)
- Outdated content with stale information
- Missing internal links between topically related pages

**Tools:**

- Screaming Frog for on-page element extraction
- Sitebulb for visual analysis and clustering
- Copyscape for duplication detection
- Google Search Console for query and page performance data

## The audit deliverable

The audit is only as good as how it's delivered. Findings sent as a PDF attachment in an email rarely produce action. Findings walked through in a presentation produce engagement and project signoff.

### Delivery methods, ranked by impact

**1. Live presentation (in-person or video call).** Highest impact. The auditor walks through findings with context and explanation, answers questions in real-time, and naturally transitions into a proposal or scope discussion at the end. Best for substantial paid audits or pre-engagement prospecting calls.

**2. Recorded screen-share walkthrough.** A pre-recorded Loom or video presentation where the auditor talks through the slides. Significantly more effective than written documents, scales without scheduling friction, and the recording can be revisited by the client. Strong default for both free and paid audits.

**3. Written PDF or slide deck delivered with a follow-up call.** PDF delivers the deliverable, the call delivers the explanation. Better than a PDF alone, weaker than a recorded walkthrough.

**4. Written document via email.** The lowest-impact option. The audit gets opened, scrolled through quickly, and forgotten. Use this only for very small audits that are essentially supplementary to other work.

The principle: audits don't sell themselves. They require explanation. Build the explanation into the delivery format.

### Deliverable formats

**Branded PDF documents** for paid audits or formal client deliverables. The branding matters: a clearly third-party-template-generated audit signals lower quality and produces lower close rates. Investing in a branded template once pays off across every audit thereafter.

**PowerPoint or Google Slides presentations** for both live and recorded walkthroughs. Free audits warrant shorter, more focused decks. Paid audits warrant deeper, more comprehensive ones.

**Spreadsheet companions** for the implementation team. The presentation explains the findings; the spreadsheet contains the prioritized to-do list with assigned owners and target dates. Without the spreadsheet, the audit doesn't translate into work that ships.

### Presentation structure that works

Effective audit presentations follow a consistent shape:

1. **Context.** Why the audit matters, what was examined, brief overview of methodology.
2. **Performance baseline.** Current state. Traffic, rankings, link profile, conversion. The "you are here" moment.
3. **Major findings, ranked by impact.** Top three to five issues that, if fixed, will move the needle. Not the full issue list, just the leverage points.
4. **Detailed findings by category.** Technical, on-page, content, off-page. Issues with severity and recommended fix.
5. **Recommendations and roadmap.** Prioritized action list with rough effort estimates and expected impact.
6. **Next steps.** Whether the recommendation is to engage on implementation, to hand off the document for in-house execution, or to schedule a follow-up.

## Free audit versus paid audit

A strategic decision worth making explicitly: are audits part of your sales process or are they a billable service?

**Audit as prospecting tool.** Free or heavily discounted, lighter depth, focused on identifying enough opportunity to motivate the client to engage on a larger project. Conversion is to a paid SEO engagement, not to a paid audit.

**Audit as billable service.** Full-depth, paid as a standalone deliverable, optionally bundled with implementation. Pricing typically scales with site size and complexity ($1,500 to $10,000+ depending on scope). Conversion is from audit to implementation, but the audit itself produces revenue.

Both models work. The choice depends on the agency's positioning, target market, and sales motion. What doesn't work is splitting the difference: a free audit with the depth of a paid audit (you bleed margin) or a paid audit with the depth of a free one (clients feel ripped off).

For most partner agencies we work with, free audits as part of a sales process produce the strongest pipeline. For specialized firms with established expertise, paid audits work better.

## Common audit mistakes

A few patterns we see repeatedly:

- **Issue dumps.** A 200-item list of every minor issue, no prioritization, no recommendations. The client doesn't know where to start, so they don't.
- **Tool output as deliverable.** Pasting Screaming Frog or Ahrefs reports directly into a PDF. The client got those tools' output without paying for them. The value is the analysis, not the data.
- **No business framing.** Findings disconnected from business impact. A robots.txt issue is interesting; "this is preventing your top revenue page from indexing" is actionable.
- **No prioritization.** Everything labeled "important." The client picks what's easy, not what matters.
- **No delivery beyond the document.** Audit emailed and forgotten.

If the audit you delivered didn't produce implemented changes, the audit failed. The artifact isn't the goal. The work that follows is.

## How we approach SEO audits at SEO Brothers

Our default audit deliverable is a recorded walkthrough plus a branded PDF and an implementation spreadsheet. The recording handles the explanation and scales across multiple stakeholders at the client. The PDF is the durable artifact. The spreadsheet is what ships work.

For partner agencies, we white-label the audit so it goes out under their brand. We build the audit, they deliver it. The recording is recorded by them or by us under their brand depending on the engagement.

If you're trying to figure out whether to run audits in-house or partner on them, [book a call](/#book-call) and we'll walk through your model.
