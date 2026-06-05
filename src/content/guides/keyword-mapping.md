---
title: "Keyword Mapping: Assigning the Right Keywords to the Right Pages"
category: seo
publishDate: 2019-01-15
updatedDate: 2026-05-06
author: "Adam Bate"
summary: Keyword research tells you what to target. Keyword mapping decides which page targets what. The framework, the spreadsheet structure, the intent groups, and the competitive analysis process I use on every campaign.
featured: true
---

You can optimize a page for more than one keyword. You shouldn't spend much time optimizing multiple pages for the same keyword.

I remember an old mentor telling me this years ago, and it's the line I keep coming back to whenever a new campaign starts. While it is technically possible to have multiple rankings in the search engines for a specific term, your effort is much better spent making different pages on your website highly relevant to completely unique keyword groups.

Most SEOs speed through this process. They finish their keyword research, dive straight into on-page and off-page optimization, and the typical result is that the homepage gets stuffed with most of the keywords. The homepage ends up over-optimized, the deeper pages stay invisible, and the link-building budget gets thrown at a page that's already trying to do too much.

Take the time to do this properly.

This guide is the consolidated keyword-mapping framework I've used and written about across the keyword theme of the month I ran in early 2019, plus the additions and updates that have come up since (search-intent shifts, the rise of E-E-A-T signals, AI-driven SERP changes, and so on). The fundamentals haven't moved. Some of the tooling has.

This is a sister guide to our [keyword research playbook](/guides/keyword-research/). If you don't have a keyword list yet, start there. If you do, this is what comes next.

## What keyword mapping is

Keyword mapping is the process of assigning keywords (discovered during your keyword research) to specific pages on a website based on searcher intent.

Once the mapping is done, you can make specific on-page recommendations to make each page genuinely relevant to its mapped keywords. It's the foundation of any on-page SEO project.

The output is usually a spreadsheet, and the spreadsheet is the artifact your developers, content writers, and SEO team work from for the rest of the campaign.

## Why bother with mapping at all

Two reasons that pay back the time investment many times over.

**Everyone has visibility on what keywords are a priority for any given page.** This matters most when you're doing ongoing content creation, where there's constant opportunity to internally link and reference other content. The mapped keywords on your core service pages and even your other blog posts can guide what anchor text to use when linking internally.

**It avoids duplicate content.** If you're consistently publishing, it's surprisingly easy to forget what was published a year ago, or even a few months ago, and write something nearly identical to existing content. With a mapping document, when a similar idea comes up, you can spot that you should refresh an existing post rather than create a new one. The existing post becomes more authoritative on the subject. The new one would have just split the signal.

## The full mapping process

### Step 1: Start with keyword research

You can't map what you haven't researched. The mapping process assumes you've already produced a keyword list with head terms, long-tail variations, search volumes, and any geographical modifiers relevant to the business. If you're missing this, work through our [keyword research guide](/guides/keyword-research/) first.

A few notes that make mapping easier downstream:

- Don't try to rank for every keyword on the list. Mapping forces prioritization, and ruthlessly cutting low-opportunity terms early saves work.
- Group plurals, synonyms, and obvious variations together while you're researching. "Dentist Halifax," "Halifax dentist," and "dentists in Halifax" all target the same page.
- Capture intent signals as you go. A keyword like "best wood stove for small house" is informational and points at a blog post. "Buy wood stove online" is transactional and points at a product or category page. Tag these as you find them.

### Step 2: Current relevancy check

For each keyword (or keyword group), figure out which page on your site is most relevant from both the user's and Google's perspective. Two complementary checks.

**The intent check.** If a user searched this query, which of your pages would actually answer it? A query about cost goes on a pricing page, not the homepage. A query about a specific service goes on the service page, not a generic capabilities page.

**The Google check.** Run the query as `site:yourdomain.com [keyword]` in Google. The page Google returns first is the page Google currently associates with that keyword. If that matches your intended page, you're aligned. If it doesn't, either Google needs to be re-pointed (through on-page changes and internal linking) or you've picked the wrong page.

Example. Searching `site:seobrothers.co link building` should return our [link building guide](/guides/link-building/) first. If it returned the homepage or the about page instead, that's a misalignment to fix.

Hopefully your intent check and your Google check agree. When they don't, I always go with the human read first. Google is usually right, but when it isn't, the fix is on-page work to re-point the signal, not capitulation to a wrong assignment.

<!-- TODO: replace with current screenshot of a site: operator search demonstrating the relevancy check -->

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

![Illustrative keyword mapping spreadsheet. Header row with columns for URL slug, mapped keywords, intent, current title, recommended title, and notes. Three example rows: a homepage row mapped to navigational brand keywords, an Invisalign service page row mapped to transactional keywords, and a wisdom-teeth-recovery blog post row mapped to informational keywords.](/images/guides/keyword-mapping-template.svg)

### Step 4: Match keyword intent to page type

This is the step that separates mappings that drive results from mappings that look organized but underperform.

There are three primary intent groups. Group your keywords accordingly before assigning pages.

**Navigational keywords** are queries where the user already knows where they're going. Brand name plus product, brand name plus login, "RBC online banking." For most local-SEO and small-business campaigns, navigational keywords are less interesting because the searcher has decided on the destination already. They map to the homepage or the specific landing page they're trying to reach. Larger brands with more brand awareness see proportionally more navigational volume.

**Informational keywords** are queries where the user wants to learn something. Two flavors worth distinguishing.

*Problem-solving* queries are immediate-need: "how to stack firewood," "how to fix a leaky toilet," "what to do for a knocked-out tooth." The user has a problem right now. They probably won't convert on first visit, but the query is an opportunity to be useful, build a relationship, and earn the brand recognition for when they're ready to act. Mostly map to blog posts, often with embedded video.

*Research* queries are evaluation-stage: "what size wood stove do I need to heat my house." The user has a problem (heating their home) but is researching a specific solution (wood stove sizing). Same destination type as problem-solving (blog content), but with stronger internal links to the relevant transactional pages. The intent has progressed.

A side note. I bought a wood stove once. Started exactly there: searching the size question. Read a few articles. Then I went into a showroom and saw the thing in action before buying. The keyword research process should anticipate that funnel. The blog post answering "what size wood stove" doesn't convert directly, but if it's good, it earns the visit to the showroom or the form fill or the call.

**Transactional keywords** are bottom-of-funnel queries indicating purchase intent. "Halifax wood stove for sale," "buy wood stove online," "where to buy a wood stove near me." These map to product pages, category pages, service pages, or location pages. Putting transactional keywords on a blog post is a common mistake that wastes the opportunity. The searcher is ready to act; meet them with a page that lets them act.

The match between intent and page type also has to align with what Google ranks. If a query returns 9 of 10 results that are blog posts, Google has decided this query is informational. Pointing a product page at it won't work no matter how well-optimized the page is. Match Google's interpretation, not your preferred one.

### Step 5: Handle existing site versus redesign

The mapping process changes slightly depending on whether you're working on a live site or a redesign.

**Existing site.** Use the current URLs. Map keywords to pages that already exist. If you have keyword excess (more good keywords than relevant pages), flag the gap. New pages may be needed, but that's a content-strategy decision, not a mapping one.

**Redesign.** Use the planned new URLs. If you're redirecting old URLs, list the final destination URL in the mapping. Add rows for newly created pages. Be cautious about moving rankings: a homepage that ranks well for a service-area term may rank worse on a dedicated service-area page initially, and the migration can cost rankings if not handled carefully. Sometimes the right call is to leave a strong homepage ranking alone and add the new page for adjacent variations.

A common scenario. An established site has the homepage ranking #2 for "[city] plumber." The instinct is to move that ranking to a dedicated `/plumbing-services/` page. Sometimes that works. Sometimes the homepage holds the ranking better because of historical link equity, and creating the new page splits the authority and drops the campaign to #5. The mapping should reflect a deliberate decision either way, not an automatic move.

## Competitor analysis as a mapping shortcut

You don't have to start every keyword research and mapping cycle from scratch. Pulling competitor keyword data accelerates the process and surfaces terms you may have missed.

I recorded a video on this back in 2019 walking through the two methods I use:

<iframe style="width:100%; aspect-ratio: 16/9; border: 0; border-radius: 12px; margin: 32px 0;" src="https://www.youtube.com/embed/_Ke7-ZP2aDQ" title="How To Identify Keywords Your Competitors Are Ranking For" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>

In writing.

### Method 1: Pull head keywords from competitor source code

Open a competitor's main pages and look at:

- **Page titles** (the most important signal of what they're targeting)
- **H1 and H2 headings**
- **Meta descriptions**
- Meta keywords (mostly unreliable, often left over from old templates, but worth a glance)

Once you have a list of head keywords, validate the search volume in Ahrefs, SEMrush, or Google Keyword Planner before committing.

If the competition is ranking well for a term and the volume is solid, consider mirroring their meta-data approach. Not copying. Mirroring the structure: if they're putting the city in the title, you should be too.

### Method 2: Use SEO tools to extract competitor rankings

Faster and more comprehensive than reading source code.

Ahrefs is our tool of choice for competitive insights, though Moz, SEMrush, and a handful of newer tools all do similar work. Drop the competitor's domain into the search bar, click Organic Keywords, and review the full list of terms they currently rank for, with positions and search volumes.

Things to look at:

- **Compare service or category pages.** If you and a competitor both have a "commercial plumbing" page, compare what each ranks for. The keywords they get that you don't are direct opportunities.
- **Mine their blog.** Their highest-traffic blog posts surface topics worth covering. If three competitors all rank for the same informational query, that's a signal it's findable, and probably reachable.
- **Filter by section or page.** Most tools let you scope keyword reports to a subdirectory or specific page. Use this to compare apples to apples.

Run this for three to five competitors and you'll have a baseline keyword list that took an hour to assemble instead of a week.

The goal isn't to copy their map. It's to make sure your map isn't missing opportunities they've already validated.

## Common mapping mistakes

A few patterns we see often.

**Homepage absorption.** Every important keyword maps to the homepage. The homepage tries to rank for everything, ranks for nothing in particular, and the deeper pages get ignored. Fix: assign head terms to category and service pages, leave the homepage to brand-and-overview keywords.

**Identical mappings across pages.** Two service pages with the same primary keyword. They cannibalize each other and Google chooses arbitrarily which to rank, often picking the weaker one. Fix: differentiate the keyword target for each page, even if the difference is just a modifier.

**Old-school keyword variation splitting.** "Cleveland home builder" mapped to one page, "home builder in Cleveland" mapped to another. Same searcher intent, different page assignments. This used to be common practice. It just doesn't cut it anymore. It produces duplicate content, thin content, or content that's been written for the search engine instead of the user. Group by intent, not by exact phrasing.

**Intent mismatch.** Transactional keywords on blog posts, informational keywords on product pages. Fix: re-check the SERP for each query and match the page type to what Google ranks.

**Anchor text neglect.** The mapping document records page titles and metas but ignores internal link anchor text. Fix: add an internal linking column or build a separate sheet showing which pages should link to which with what anchors.

**Set-and-forget.** The mapping is built in week one and never updated. Rankings shift, content gets added, the map drifts out of sync. Fix: schedule a quarterly review against current Search Console data.

## How we handle keyword mapping at SEO Brothers

Mapping is part of every campaign we run, and we treat the spreadsheet as a living artifact. Initial map at kickoff, refresh against rankings every 90 days, full re-evaluation if there's a major content addition or site migration.

For partner agencies, we deliver the mapping document alongside the on-page recommendations so their team can implement directly without us managing the deployment.

If you've got a keyword list and aren't sure how to map it across your site, [get in touch](/#book-audit) and we'll walk through the structure with you.

A parting piece of advice, the same one my first mentor in this space gave me, which I'll repeat because it's the line that matters most: multiple keywords can be mapped to a single page, but a single keyword shouldn't be mapped to multiple pages.

Get that one right and the rest of the mapping work mostly falls into place.
