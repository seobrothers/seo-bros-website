---
title: "On-Page SEO: The Elements That Actually Move Rankings"
category: seo
publishDate: 2017-09-15
updatedDate: 2026-05-06
author: "Adam Bate"
summary: A complete framework for on-page optimization. The four elements that actually move rankings, the architecture decisions that make the rest compound, and the documentation process we use on every campaign.
featured: true
---

On-page SEO is the work you do on the page itself, separate from links, technical infrastructure, or domain authority. It's also the layer most clients underinvest in, partly because it's less glamorous than link building and partly because there's enormous noise about which elements actually matter.

This guide cuts through that.

It covers the elements that demonstrably move rankings, the ones that don't, the site architecture decisions that compound on-page work, and the documentation process we use to keep on-page optimizations organized across campaigns.

Some of this I first wrote about back in 2017, and a few of the deeper sections came out of a video series I recorded in early 2019. I've embedded those videos where they belong and updated the surrounding material for 2026. The fundamentals haven't moved much. Where they have, I flag it.

## What on-page SEO actually is

Everything inside the page itself. The title tag, the headings, the body content, the URL slug, the images, the internal links, the schema markup, and the structural relationship between this page and the rest of the site.

It's distinct from technical SEO (crawlability, indexation, server response) and off-page SEO (links, brand mentions, authority).

The reason on-page work is high-leverage: it's fully under your control. You can't always force a site to earn a backlink. You can always rewrite a title tag.

## The four elements with the highest impact

Of the dozen-plus elements people optimize on a page, four account for most of the ranking impact. I tested this carefully in 2019 using the SEO Intelligence Agency's testing methodology, and the priority order has held up since.

In order of weight:

### 1. Page title (the title tag)

The single highest-weight on-page signal. The content inside the `<title>` tag in the HTML head is what Google relies on most heavily to determine page topic.

It also has to do double duty: signal relevance to the algorithm, and earn the click from the user.

What works: descriptive titles that include the primary keyword naturally, ideally near the front, followed by a brand or differentiator. Length lands around 50 to 60 characters before truncation in most desktop SERPs.

What doesn't: dynamic templates that produce identical titles across hundreds of pages, generic titles like "Home | Company Name," and titles stuffed with five variations of the same keyword.

### 2. H3 headings inside body content

This is the one that surprises people.

H3 tags placed inside the main body of the page, not in sidebars, footers, or navigation, carry surprisingly heavy weight for keyword relevance. Heavier than H1 in many of my tests, which contradicts the common assumption that H1 is the second-most-important on-page element after the title.

Use H3s to break body content into sub-sections. Include relevant keywords naturally where they fit. Don't keyword-stuff them, but don't leave the keyword off if the section is genuinely about it.

H1 is still important, but it's mostly redundant with the title tag. The H3s in body content are doing real work no other element duplicates.

### 3. Body content

The main copy on the page. Including the target keyword and natural variations in the body remains a meaningful ranking signal, and it ranks third in priority.

Things that matter:

- **Substantive content.** Pages with 1,000+ words consistently outrank thin pages on competitive terms, with the sweet spot for many topical pages around 2,000 words. (A Backlinko study from a few years back put the average word count of first-page Google results at over 1,890 words. That number has crept up since, though length on its own isn't the point.) The real test is whether the page comprehensively answers the searcher's question.
- **Original content.** Duplicate content across pages on the same site cannibalizes rankings. Boilerplate copy on service-area pages is a common offender.
- **Topic depth.** The page should cover the topic well enough that a reader doesn't immediately bounce back to Google to find more. Bounce signals matter more than they used to.

Keyword stuffing doesn't work. Mentioning the keyword and its variations naturally throughout the content does.

![Bar chart of average word count for pages on Google's first page, ranked positions 1 through 10. Position 1 averages around 2,050 words; position 10 averages around 1,660. Source: Backlinko.](/images/guides/word-count-vs-ranking.svg)

### 4. URL slug

Fourth in priority but still meaningful. The descriptive words in the URL after the domain signal page topic to both Google and users.

Use real-language slugs. `/on-page-seo` works. `/page?id=237` doesn't. Keep slugs short, lowercase, kebab-case, no dates, no year markers, no trailing fluff like `-guide` or `-tips`.

### What about everything else?

H1 tags, H2 tags, H4 tags, meta descriptions, anchor links, bold and italic text, and so on all have minor impact. Optimizing them is good hygiene but they aren't where the ranking power lives. The four above account for the bulk of the relevance signal a page sends.

## Beyond the priority four

The full on-page framework I run through on every page worth optimizing.

### Content quality and length

The strategic layer underneath the body-text element.

- **Original throughout.** No duplicate content across pages on the same site, no scraped or lightly-rephrased content from other sites.
- **Length matched to topic depth.** Comprehensive pages on competitive topics need 2,000+ words. Simple supporting pages need less. Word count targets shouldn't be hit by padding.
- **Topical authority through related content.** Domains that comprehensively cover a topic across multiple pages outrank domains that cover it shallowly on a single page. This is the silo principle, covered below.

### Metadata

The technical layer of head-section optimization.

- **Page title** as covered above. Highest-weight on-page signal.
- **Meta description** is the snippet shown in search results. Not a direct ranking factor, but heavily affects click-through rate. Include keywords (Google bolds them in the snippet) and action-oriented language. Phrases like "click here," "save x%," and "get a free quote" all earn clicks.
- **Meta keywords** is dead. **Please, if you're still using and stuffing keywords into the meta keywords tag, please stop.** This was already obsolete when I first wrote about on-page SEO years ago. It is more obsolete now.

For WordPress sites, the Yoast SEO plugin handles the metadata side cleanly. I've used Yoast on every WordPress install I've worked on for years. Rank Math is the alternative most agencies have moved to since. Either is fine.

<!-- TODO: replace with a current screenshot of a SERP listing showing meta description and click-driving language; legacy had an example image -->

### Headings and content formatting

Single H1 per page. Multiple H2s for major sections. H3s for sub-sections inside body content (the high-leverage element). H4 and below for finer structure.

Hierarchical, not skipping levels. Pages with H1 → H4 → H2 disorder confuse both screen readers and crawlers.

### Images and rich media

Images need three things to add real value:

- **Filename.** `plumber-vancouver.jpg`, not `IMG_4837.jpg`. Search engines parse the filename for context.
- **Alt text.** Descriptive of what the image actually shows, including the keyword if it fits naturally. Don't stuff alt text with the keyword across every image. That's a footprint, not optimization.
- **File weight.** Compressed, modern format like WebP, lazy-loaded if below the fold.

Embedded video adds topical signal and tends to lift time-on-page. YouTube embeds are the easiest path. Self-hosted video is heavier and rarely worth the technical overhead unless there's a specific reason.

### Page speed

Page speed affects ranking directly through Core Web Vitals (LCP, INP, CLS) and indirectly through bounce rate.

Areas to focus on:

- **Server response time.** Time to first byte under 600ms ideally, under 200ms for high-performance sites.
- **Caching.** Browser caching, page caching, CDN delivery.
- **Image optimization.** Compress, use modern formats, lazy-load below-the-fold images.
- **JavaScript and CSS.** Minify, defer non-critical scripts, eliminate render-blocking resources.

Tools: Google PageSpeed Insights, GTmetrix, WebPageTest. We also cover [interaction to next paint](/guides/interaction-to-next-paint/) in detail since INP replaced FID and is the most commonly missed Core Web Vital.

### Schema markup

Structured data that helps search engines understand the page contextually. The schema.org vocabulary covers organizations, local businesses, articles, products, recipes, events, FAQs, and dozens of other types.

The biggest wins come from:

- **LocalBusiness schema** for any business with a physical or service-area location
- **FAQ and HowTo schema** for content that answers common questions
- **Product and Review schema** for ecommerce
- **Organization and Person schema** for E-E-A-T signal building

Validate with Google's Rich Results Test before deploying. The number of schema implementations that look right in code and fail validation in the wild is genuinely surprising.

## Site architecture and content silos

On-page work compounds when the site architecture supports it. Without good architecture, individual page optimizations don't reinforce each other.

I recorded a video on this back in 2019 that still holds up. Three aspects to keep in mind when structuring site content:

<iframe style="width:100%; aspect-ratio: 16/9; border: 0; border-radius: 12px; margin: 32px 0;" src="https://www.youtube.com/embed/fPh50irZe5c" title="3 Aspects For Optimizing Your Website Structure" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>

Here's the framework in writing.

**First, you need supporting content beyond your services.** Even if you're not committed to an ongoing content marketing effort, the site needs enough content to satisfy the searcher's demand for information while they're researching. If a potential customer can't find enough info to make a purchase decision, they go elsewhere.

**Second, content should be organized in a parent-children relationship.** A site that offers both plumbing and electrical services is operating in two separate searcher intents. Each section needs a top-level parent page for that solution or service, with supporting content (sub-services, how-to articles) sitting underneath the parent.

**Third, internal links should stay within relevant content.** When Google crawls a piece of content, the other content it finds should be very relevant. Supporting content links to siblings within its silo and back up to the parent. A "how to fix a leaky toilet" page does not link to "how to wire a light switch." Different silos. Different intents. Crossing the wires breaks the relevance signal the silo structure exists to build.

![Side-by-side comparison of URL structures. Left: a siloed hierarchy with /services/ branching into /plumbing/ and /electrical/, each with its own child pages, and a green "Why it works" callout. Right: a flat structure with all pages at the same level (services, blog posts, admin pages mixed together) and a red "Why it fails" callout.](/images/guides/url-structure-comparison.svg)

A plumbing example. Parent page: `/services/plumbing/` targeting "[city] plumbing services." Child pages within the silo: `/services/plumbing/leaky-faucet-repair/`, `/services/plumbing/water-heater-installation/`, `/services/plumbing/drain-cleaning/`. Each child page targets a more specific, longer-tail keyword. Each links back to the parent and laterally to closely related sibling pages.

What you want:

- Parent pages link down to all relevant child pages
- Child pages link back up to parent pages
- Sibling pages link to each other when topically related
- Cross-silo links are rare and editorial, not structural

Done well, siloing produces ranking lifts even without acquiring a single new backlink. The internal link graph itself is doing the work.

For local businesses specifically, the same principle extends to your service-area architecture. See our [local SEO guide](/guides/local-seo/) for the local-specific application.

## The on-page optimization document

The deliverable side of on-page work, the part that determines whether recommendations actually get implemented.

I walked through the document we use in a 2019 video. The structure has held up well even as the surrounding toolset has evolved.

<iframe style="width:100%; aspect-ratio: 16/9; border: 0; border-radius: 12px; margin: 32px 0;" src="https://www.youtube.com/embed/dLYHgkbiEls" title="On-Page Optimization Document Walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>

The document lives in Google Sheets so it's collaborative in real time. Multiple drafts and works-in-progress are visible to everyone, which matters when partners and clients are watching the project move.

The base tabs:

- **Keyword research sheet** for the source keyword list
- **Website optimization sheet** as the primary implementation tracker (this is where the [keyword mapping](/guides/keyword-mapping/) lives)
- **Content idea sheet** for blog posts and supporting content not yet built
- **301 redirect sheet** for any URL changes during the campaign

Depending on scope, we add columns and tabs for canonical URLs, page speed metrics (TTFB, total load time), internal and external link counts, Search Console visibility data, and any site-wide technical changes (canonical tags, hreflang management).

Live data comes from Sitebulb in combination with Screaming Frog crawls, refreshed on a cadence so the document stays current. Both have been the core of our on-page tooling for years.

The exact tab structure isn't sacred. What matters is that the document captures every page, every recommendation, every priority, and every change as it ships. Without that, on-page work fragments across emails and tickets and never lands cleanly.

## How we approach on-page SEO at SEO Brothers

On-page is the foundation for everything else. We start every campaign with a full on-page audit, build the optimization document, work through the priority pages first, and revisit the document quarterly to keep it current.

For partner agencies, we deliver the optimization sheet as a complete artifact. The agency or their developers can implement directly, or we can handle deployment depending on the engagement.

If your site is underperforming and you're not sure whether the issue is on-page, technical, or off-page, [get in touch](/tools/free-seo-audit/) and we'll diagnose where the leverage is.
