---
title: "Google AI Overviews and SGE: How They Changed Search and What to Do About It"
category: seo
publishDate: 2026-04-30
updatedDate: 2026-05-28
author: "Devon Bate"
summary: AI Overviews are the largest single shift in Google's SERP layout in a decade. What changed, the impact on click-through rates, the optimization tactics that work in the new layout, and where the dust is still settling.
featured: false
---

Google's Search Generative Experience launched in May 2023 as an opt-in experiment. By May 2024 it had been renamed "AI Overviews" and rolled out as the default for many query types. By 2026 it's the standard SERP layout for a substantial portion of searches in the US, with continued geographic expansion.

For SEO, this is the largest single shift in SERP layout in a decade. The question is no longer "will this happen" or "should I prepare for it." The question is what's working in the new layout and what isn't.

This guide covers what AI Overviews are, what changed in click-through behavior, the optimization tactics that have proven out since launch, and where the dust is still settling.

## What AI Overviews actually are

When you search for many query types, Google now produces a generated summary at the top of the SERP, above the traditional organic results. The summary is generated from a curated set of source pages, each of which is linked from within the summary itself.

Three things are happening simultaneously when an AI Overview appears:

1. **Google is using its language model** (a fine-tuned version of Gemini) to synthesize an answer
2. **Google is selecting source pages** to draw from and link to
3. **Google is pushing the traditional organic results down** the page, sometimes substantially

The third point is what changed the SEO conversation. Even if your page is the source for the AI Overview, your traditional organic listing is now lower on the page than it used to be.

![Diagram of an AI Overview on a results page showing three things happening at once: Google's Gemini model synthesizes a generated answer at the top of the page, Google selects and links a small set of source pages within that answer, and the traditional organic results are pushed down the page even when a site is one of the cited sources.](/images/guides/google-search-generative-experience/ai-overview-anatomy.svg)

## The click-through impact

Pre-rollout estimates predicted dramatic drops in click-through rates as users got their answers from the overview without clicking through. The reality has been mixed and depends heavily on query type.

**Informational queries** see the largest impact. Pure informational searches where the user wanted a quick answer (definitional queries, factual queries, simple how-to queries) have shown steep CTR drops. Studies published through 2025 put the decline for the top-ranking page on these queries at around 58% to 61%. Ahrefs measured a 58% drop in clicks for the number-one result when an AI Overview is present, and Seer Interactive found a 61% fall in organic CTR on informational queries. The user gets the answer in the overview and doesn't click through.

**Commercial and product queries** show variable impact. AI Overviews on commercial queries often display product summaries with multiple linked sources, and click-through to specific products has held up better than to information sites. The intent matters: a query about "best running shoes 2026" still drives clicks to product reviews, even if the overview surfaces top picks.

**Local queries** are largely unchanged. Local pack results sit above AI Overviews in most layouts, and the local-business intent isn't well-served by a generated summary, so the overview frequency and impact on local CTR has been smaller than feared.

**Navigational queries** are mostly unaffected. Users searching for a specific brand or product know where they're going, and AI Overviews rarely intercede on these queries.

![Horizontal bar chart of how much AI Overviews reduce click-through by query type. Informational queries see the largest drop, roughly 58 to 61 percent per 2025 studies from Ahrefs and Seer Interactive. Commercial and product queries see a smaller, variable impact. Local queries see minimal impact because the local pack sits above the overview. Navigational queries are mostly unaffected.](/images/guides/google-search-generative-experience/ctr-impact-by-query-type.svg)

The cumulative impact for sites whose traffic skews informational has been real. Sites whose traffic skews commercial or local have been less affected.

## What "showing up" in AI Overviews looks like

Two ways your site can appear in the new SERP layout.

**As a source for the AI Overview itself.** Google links to a small number of source pages within the overview text. Being one of these sources delivers some click-through (usually less than a top organic position would have), plus brand-visibility benefits even when users don't click.

**As a traditional organic result below the overview.** This is still the largest source of organic traffic. The overview pushed organic results down the page, but the long-tail of clicks for users who want more than the summary still flows through traditional organic.

Optimizing for both matters. Getting cited in the overview is valuable but isn't a substitute for ranking organically.

## Optimization tactics that have proven out

A year and a half into the broader rollout, some optimization patterns have become clearer.

**Direct answer formatting at the top of pages.** Pages that answer the query explicitly in the first paragraph (rather than burying the answer below contextual setup) are cited more frequently in overviews. Same principle as featured snippet optimization, just with the new generation system as the audience.

**Question-and-answer structure.** Content organized as questions with clear, direct answers maps cleanly onto how the language model parses and reuses information. FAQ pages and FAQ sections within other pages perform well as overview source candidates.

**Entity clarity and schema markup.** Structured data continues to matter. The model uses schema-derived understanding to determine what a page is about and how it relates to other entities. Sites with strong schema markup are cited more often.

**Original information.** Generated summaries pull most heavily from sources that contribute distinct information rather than rehashes of the same general advice. Original research, distinctive analysis, first-hand expertise, and proprietary data all increase citation rates.

**E-E-A-T signals strengthened.** Author markup, real credentials, transparent sourcing, and trust signals have always mattered in YMYL categories. They now matter more broadly because the model factors source authority into its citation decisions.

**Content freshness.** AI Overviews seem to favor recent content for queries where recency matters. Stale evergreen content gets cited less often than refreshed equivalents.

## What hasn't worked

A few approaches that came up early and haven't panned out.

**Trying to game the model with adversarial prompting.** Embedded instructions hoping to manipulate the AI Overview output. These don't work and have been actively detected and penalized when found.

**Producing content explicitly to be summarized rather than read.** Optimizing for the model at the expense of human readers. Pages designed this way underperform on both axes: the model's preferences shift over time, and human-readability is part of what the model evaluates anyway.

**Aggressive structured-data padding.** Adding schema for everything in hopes of being cited more often. Beyond a baseline of relevant schema, more isn't better. Excessive or misleading schema is detected.

**Pulling content behind authentication or paywalls to "force" clicks.** Backfires by removing the page from consideration entirely.

## The strategic shift

The broader implication for SEO strategy isn't a tactical recipe. It's a shift in how to think about value.

**Pure top-of-funnel informational content is harder.** A guide to "how does X work" was historically a strong traffic driver. With AI Overviews summarizing the answer, the same guide produces less traffic for the same effort.

**Mid-funnel and bottom-of-funnel content is more valuable.** Comparison content, decision-stage research, product-specific reviews, and content tied to commercial intent has held up better. The shift in resource allocation makes sense.

**Brand visibility through citation matters more.** Even when users don't click, being cited in the overview produces brand impressions. Sites that show up consistently in overviews for their topic build brand presence even when traffic doesn't flow.

**Authority and expertise signals compound.** The model's source selection rewards genuine expertise. The investment in real authority (credentialed authors, original research, deep topical coverage) pays off more than it did in the prior era.

![Marketing funnel showing where content value is shifting under AI Overviews. The top of the funnel, informational content like definitions and simple how-to queries, gets harder because answers are summarized in the results page and produce less traffic. The middle, comparison and decision-stage research, and the bottom, commercial intent such as product pages, reviews, and buy-now queries, become more valuable because commercial intent still drives clicks.](/images/guides/google-search-generative-experience/funnel-value-shift.svg)

For broader content strategy implications, see our [what to blog about guide](/guides/what-to-blog-about/), updated for the post-AI-Overviews reality.

## Tactical optimizations by content type

**Informational content.**
- Lead with a direct answer
- Structure as Q&A with clear question headings
- Include comparative tables where applicable
- Link to deeper authoritative sources
- Mark up with FAQ schema

**Product pages.**
- Comprehensive product details with comparisons
- Schema markup for product, review, and pricing
- User-generated reviews integrated visibly
- Original photography
- Specifications presented in structured format

**Local business pages.**
- Google Business Profile fully optimized (continues to dominate local AI Overview surfacing)
- Reviews with depth and recency
- Service-area pages with unique content
- Schema for LocalBusiness, Service, FAQ

**Brand and navigational pages.**
- Strong About content with author/founder information
- Consistent NAP and brand information across the web
- Active social profiles linked from the site
- Clear organization schema

For deeper coverage of related dynamics in the SERP, see our [SERP features evolution guide](/guides/serp-features-evolution/), which covers the broader history of SERP changes including AI Overviews in context.

## Where the dust is still settling

Several things are still in flux as of 2026 and worth monitoring rather than acting on definitively.

**Citation patterns continue to shift.** Google has refined which sources get cited multiple times since the initial rollout. The patterns will continue to evolve.

**International rollout is uneven.** AI Overviews launched in the US first and have expanded geographically at varying speeds. Some markets still see traditional SERPs dominating. Geographic monitoring matters.

**YMYL handling continues to evolve.** Medical, legal, and financial query handling has changed multiple times since rollout, with Google sometimes pulling back AI Overview frequency in these categories and sometimes expanding.

**Competitive search engine response.** Bing's Copilot, Brave Search's AI features, Perplexity, and other AI-driven search products are changing the broader search landscape, not just Google's. SEO strategy increasingly needs to consider visibility across multiple AI-driven discovery surfaces.

## How we approach AI Overview optimization at SEO Brothers

Standard SEO fundamentals still produce most of the value. What's changed is the weighting on certain elements: structured data, direct answers, content freshness, and author authority all matter more in the new layout. We've adjusted our default playbook to weight these more heavily without abandoning the broader fundamentals.

For partner agencies whose clients are seeing traffic shifts from AI Overviews, we run targeted analyses to identify which of the client's content types are most affected and where to focus the rebalanced investment.

If your traffic has been moving and you're not sure how much is AI Overview impact versus other factors, [get in touch](/sign-up/) and we'll diagnose where the shift is coming from.
