---
title: "Keyword Mapping: Assigning the Right Keywords to the Right Pages"
category: seo
publishDate: 2026-04-30
summary: Keyword research tells you what to target. Keyword mapping decides which page targets what. The framework, the spreadsheet structure, and the competitive analysis process we use on every campaign.
featured: true
---

Keyword research and keyword mapping are different things, and conflating them is one of the most common reasons SEO campaigns underdeliver.

Keyword research surfaces opportunities. Keyword mapping decides which page on your site is responsible for ranking for which keyword. Without that second step, you end up with three pages competing for the same query, your homepage absorbing rankings that should belong to specific service or category pages, and content that fails to align with searcher intent.

This guide covers the full mapping process: how to do it, how to validate it against what Google actually ranks, how to layer in competitor analysis, and how to think about keyword intent so the page you assign to a keyword is actually the right kind of page.

This is a sister guide to our [keyword research playbook](/guides/keyword-research/). If you don't have a keyword list yet, start there. If you do, this is what comes next.

## What keyword mapping is

Keyword mapping is the assignment problem. You have a list of keywords. You have a set of pages on your site. Mapping is the process of deciding which keyword targets which page, in a way that:

- Each page has a clear primary keyword and a small group of related variations
- No two pages compete for the same keyword
- The page type matches the keyword intent (transactional keywords on category or service pages, informational keywords on blog posts, navigational keywords on the homepage)
- The recommended on-page changes are documented and trackable

The output is usually a spreadsheet, and the spreadsheet is the artifact your developers, content writers, and SEO team work from for the rest of the campaign.

## The full mapping process

### Step 1: Start with keyword research

You can't map what you haven't researched. The mapping process assumes you've already produced a keyword list with head terms, long-tail variations, search volumes, and any geographical modifiers relevant to the business. If you're missing this, work through our [keyword research guide](/guides/keyword-research/) first.

A few notes that make mapping easier downstream:

- Don't try to rank for every keyword on the list. Mapping forces prioritization, and ruthlessly cutting low-opportunity terms early saves work.
- Group plurals, synonyms, and obvious variations together while you're researching. "Dentist Vancouver," "Vancouver dentist," and "dentists in Vancouver" all target the same page.
- Capture intent signals as you go. A keyword like "best wood stove for small house" is informational and points at a blog post. "Buy wood stove online" is transactional and points at a product or category page. Tag these as you find them.

### Step 2: Current relevancy check

For each keyword (or keyword group), identify which page on your site is most relevant to it from both the user's and search engine's perspective. Two complementary checks:

**The intent check.** If a user searched this query, which of your pages would actually answer it? A query about cost goes on a pricing page, not the homepage. A query about a specific service goes on the service page, not a generic capabilities page.

**The Google check.** Run the query as `site:yourdomain.com [keyword]` in Google. The page Google returns first is the page Google currently associates with that keyword. If that matches your intended page, you're aligned. If it doesn't, either Google needs to be re-pointed (through on-page changes and internal linking) or you've picked the wrong page.

Example: searching `site:seobrothers.co link building` should return our [link building guide](/guides/link-building/) first. If it returned the homepage or the about page, that's a misalignment to fix.

### Step 3: Build the mapping document

The mapping document is a spreadsheet, one row per page, with the following columns at minimum:

| Column | Purpose |
|---|---|
| URL slug | The page being mapped |
| Mapped keywords | Primary keyword + close variations |
| Search intent | Navigational / informational / transactional |
| Current page title | What's there now |
| Recommended page title | What it should be |
| Current meta description | What's there now |
| Recommended meta description | What it should be |
| Notes | Word count targets, alt text needs, internal linking, content recommendations |

Keep "current" and "recommended" in separate columns. This makes it easy for clients or stakeholders to see exactly what's changing, and it makes review faster than diff-style edits.

Optional columns we add depending on project size:

- Canonical URL (for duplicate-content scenarios)
- Internal link count (target and current)
- External link count
- Page speed metrics (TTFB, total load time)
- Search Console current ranking and impressions

For data-heavy projects, we pull this in via Sitebulb or Screaming Frog and refresh the sheet on a cadence so the recommendations stay current.

### Step 4: Match keyword intent to page type

This is the step that separates mappings that drive results from mappings that look organized but underperform.

There are three primary intent categories. Group your keywords accordingly before assigning pages.

**Navigational keywords** are queries where the user already knows where they're going. Brand name + product, brand name + login, "RBC online banking." For most SEO campaigns, navigational keywords are less interesting because the searcher has decided on the destination already. They map to the homepage or the specific landing page they're trying to reach.

**Informational keywords** are queries where the user wants to learn something. Two flavors worth distinguishing:

- *Problem-solving* queries like "how to stack firewood" or "how to fix a leaky toilet." The user has an immediate need, often won't convert on first visit, but creates an opportunity to be useful and earn the relationship. These map to blog posts or knowledge-base content, often with embedded video.
- *Research* queries like "what size wood stove do I need to heat my house." The user is evaluating before buying. These also map to blog content but with stronger internal links to the relevant transactional pages.

**Transactional keywords** are bottom-of-funnel queries indicating purchase intent. "City wood stove for sale," "buy wood stove online," "where to buy a wood stove near me." These map to product pages, category pages, service pages, or location pages. Putting transactional keywords on a blog post is a common mistake that wastes the opportunity.

The match between intent and page type also has to align with what Google ranks. If a query returns 9 of 10 results that are blog posts, Google has decided this query is informational. Pointing a product page at it won't work no matter how well-optimized the page is. Match Google's interpretation, not your preferred one.

### Step 5: Handle existing-site versus redesign scenarios

The mapping process changes slightly depending on whether you're working on a live site or a redesign.

**Existing site.** Use the current URLs. Map keywords to pages that already exist. If you have keyword excess (more good keywords than relevant pages), flag the gap. New pages may be needed, but that's a content-strategy decision, not a mapping one.

**Redesign.** Use the planned new URLs. If you're redirecting old URLs, list the final destination URL in the mapping. Add rows for newly created pages. Be cautious about moving rankings: a homepage that ranks well for a service-area term may rank worse on a dedicated service-area page initially, and the migration can cost rankings if not handled carefully. Sometimes the right call is to leave a strong homepage ranking alone and add the new page for adjacent variations.

A common scenario: an established site has the homepage ranking #2 for "[city] plumber." The instinct is to move that ranking to a dedicated `/plumbing-services/` page. Sometimes that works. Sometimes the homepage holds the ranking better because of historical link equity, and creating the new page splits the authority and drops you to #5. The mapping should reflect a deliberate decision either way, not an automatic move.

## Competitor analysis as a mapping shortcut

You don't have to start every keyword research and mapping cycle from scratch. Pulling competitor keyword data accelerates the process meaningfully and surfaces terms you may have missed.

Two methods we use:

### Method 1: Pull head keywords from competitor source code

Open a competitor's main pages and look at:

- **Page titles** (the most important signal of what they're targeting)
- **H1 and H2 headings**
- **Meta descriptions**
- Meta keywords (mostly unreliable, often left over from old templates, but worth a glance)

Once you have a list of head keywords, validate the search volume in Ahrefs, SEMrush, or Google Keyword Planner before committing.

### Method 2: Use SEO tools to extract competitor rankings

Faster and more comprehensive than reading source code.

In Ahrefs, SEMrush, or Moz, enter the competitor's domain, click into their organic keywords report, and review the full list of terms they currently rank for, with positions and search volumes.

Things to look at:

- **Compare service or category pages.** If you and a competitor both have a "commercial plumbing" page, compare what each ranks for. The keywords they get that you don't are direct opportunities.
- **Mine their blog.** Their highest-traffic blog posts surface topics worth covering. If three competitors all rank for the same informational query, that's a signal it's findable, and probably reachable.
- **Filter by section or page.** Most tools let you scope keyword reports to a subdirectory or specific page. Use this to compare apples to apples.

Run this for three to five competitors and you'll have a baseline keyword list that took an hour to assemble instead of a week.

The goal isn't to copy their map. It's to make sure your map isn't missing opportunities they've already validated.

## Common mapping mistakes

A few patterns we see often:

**Homepage absorption.** Every important keyword maps to the homepage. The homepage tries to rank for everything, ranks for nothing in particular, and the deeper pages get ignored. Fix: assign head terms to category and service pages, leave the homepage to brand-and-overview keywords.

**Identical mappings across pages.** Two service pages with the same primary keyword. They cannibalize each other and Google chooses arbitrarily which to rank, often picking the weaker one. Fix: differentiate the keyword target for each page, even if the difference is a modifier.

**Intent mismatch.** Transactional keywords on blog posts, informational keywords on product pages. Fix: re-check the SERP for each query and match the page type to what Google ranks.

**Anchor text neglect.** The mapping document records page titles and metas but ignores internal link anchor text. Fix: add an internal linking column or build a separate sheet showing which pages should link to which with what anchors.

**Set-and-forget.** The mapping is built in week one and never updated. Rankings shift, content gets added, the map drifts out of sync. Fix: schedule a quarterly review against current Search Console data.

## How we handle keyword mapping at SEO Brothers

Mapping is part of every campaign we run, and we treat the spreadsheet as a living artifact. Initial map at kickoff, refresh against rankings every 90 days, full re-evaluation if there's a major content addition or site migration.

For partner agencies, we deliver the mapping document alongside the on-page recommendations so their team can implement directly without us managing the deployment.

If you've got a keyword list and aren't sure how to map it across your site, [book a call](/#book-call) and we'll walk through the structure with you.
