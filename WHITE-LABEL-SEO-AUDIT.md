# White-Label SEO Visibility Audit

_Run 16 September 2026. Sources: live HTTP checks on seobrothers.com, Google's
indexed results, the Ahrefs API (SERP snapshots, keyword history back to 2017,
full link profile) and the Cloudflare zone config for seobrothers.com._

---

## The question

We rank number two in the United States for "white label seo pricing" and are
nowhere for "white label seo". Are we suppressed?

## The answer

No. Nothing I can measure points to suppression. The two terms have different
histories and the gap has an ordinary explanation.

"White label seo pricing" ranks because `/pricing/` is a continuously live URL
that has been climbing steadily, and the term is difficulty 1. Its US position
by month: 66 in March 2025, 16 in September, 12 in December, 1 by June 2026.
Nothing was done to it. It simply stayed up.

"White label seo" is missing because **the page that used to rank for it was
deleted in June 2026**, and its URL now returns a 410 Gone. The rankings were
real. They were on the previous domain, and they were on one specific URL.

There is one genuine mistake to fix, one large link leak to clean up, and one
thing to keep an eye on.

### What was checked and came back clean

These are the things that would indicate a technical or algorithmic problem.
None of them shows one, which is the basis for ruling suppression out.

| Check | Result |
|---|---|
| `robots.txt` | `Allow: /` for all agents, sitemap declared |
| Meta robots on key pages | `index,follow` on home, services, guide, pricing |
| Canonicals | Self-referencing and correct on every page checked |
| `www` handling | 301 to the apex domain, single hop |
| HTTPS and response codes | Clean 200s, no redirect chains on live pages |
| XML sitemap | Live, 138 URLs, submitted in `robots.txt` |
| Indexation | Pages return in Google's results when queried directly |
| Domain authority | Ahrefs DR 50, 968 live referring domains, 4,435 live backlinks |

**Site traffic did not fall after the June restructure.** Ahrefs organic
traffic for seobrothers.com, all countries, by month: 51 in April 2026, 58 in
May, 157 in June, 269 in July, 191 in August, 261 in September. The restructure
cost the head term specifically. It did not cause sitewide damage, which is
another reason this does not look like a penalty.

One note on the site's shape: of the 138 URLs in the sitemap, 105 are guides and
82 of those are programmatic city pages following the pattern
`/guides/{city}-seo/`. They are substantial, roughly 2,500 words each, and they
are the site's current traffic source. Worth knowing when judging overall
quality signals.

---

## 1. We really did rank, and here is the record

The rankings were on **seobrothers.co**, the previous domain, at the URL
**`/white-label-seo/`**. Ahrefs' record of that page for the term "white label
seo":

| Date | US | Canada |
|---|---|---|
| Jul 2020 | 10 | 6 |
| **Jan 2021** | **2** | **1** |
| Jul 2021 | 11 | 4 |
| Jan 2022 | 7 | 4 |
| Jul 2022 | 7 | 5 |
| Jan 2023 | 10 | 6 |
| Jul 2023 | 9 | 8 |
| Jan 2024 | 17 | 9 |
| Jul 2024 | 28 | 15 |
| Jan 2025 | 38 | 22 |
| Mar 2025 | – | 23 |
| Jun 2025 | – | – |

Number two in the US and number one in Canada, exactly as remembered. Ahrefs
dates that peak to January 2021 rather than 2017, but its keyword coverage in
2017 was much thinner than it is now, so an earlier run would not necessarily
appear in this record. The shape of the story is the same either way.

That same URL simultaneously held the whole family of terms. In January 2022 it
ranked 6 to 9 in the US for "white label seo agency", "white label seo
services", "white label seo packages", "white label seo company", "white label
seo reseller" and "white label seo pricing" all at once. One page, seven
commercial terms.

**Organic traffic on seobrothers.co** peaked at roughly 6,500 visits a month in
August 2022, settled around 500 a month through 2024, then ended with the
migration: 299 in May 2025, 57 in June, 4 in July. The .com domain now does
about 260 a month across all countries.

---

## 2. What happened to it

Three things in sequence, and only the last one was a mistake.

**A slow decay from 2021 to 2025.** The page drifted from 2 to 38 over four
years without being touched. That is ordinary competitive decay on an ageing
page in a category that got more crowded.

**The domain migration in mid-2025.** seobrothers.co now 301s to seobrothers.com
and the homepage redirect works correctly: 481 referring domains on the old
homepage land on the new one. Migrations cost some equity, and this one did.

**The June 2026 restructure, which deleted the URL.** `WHITE-LABEL-RESTRUCTURE.md`
records the decision to split the 3,872-line hub into a sales page at
`/white-label-seo-services/` and a guide at `/guides/white-label-seo/`, and to
retire `/white-label-seo/` as a 404. The stated reasoning was that the old hub
"has ~zero inbound links" and that the folder was "suspected of being
suppressed."

Both premises were wrong:

- The hub has **32 live referring domains**, including sites at domain rating
  66, 54, 51 and 50.
- There is no evidence the folder was suppressed. It ranked top ten for four
  years and declined gradually, which is not what suppression looks like.

It was also implemented more harshly than planned. The plan said 404; production
returns **410 Gone**, which tells Google the URL is permanently withdrawn and to
stop asking. That is served by a dedicated Cloudflare Worker route on the zone:

```
seobrothers.com/white-label-seo/  ->  script "wls-410-gone"
```

That route is not in the repo. It intercepts the path before the site ever sees
it, so no redirect in `_redirects` can fire until the route is removed.

---

## 3. Where that leaves us today

Three pages now compete for one term, and none of them has the authority to win
it.

| Page | Words | Live referring domains | Internal links |
|---|---:|---:|---|
| `/` (homepage) | ~1,300 | 694 | sitewide logo |
| `/white-label-seo-services/` | 4,520 | 2 | nav |
| `/guides/white-label-seo/` | 4,300 | 0 | footer |
| `/pricing/` | 3,486 | 0 | nav |
| `/white-label-seo/` (410) | – | 32 | none |

The navigation item labelled "White Label SEO" points at the services page. The
guide, which is the page actually aimed at the head term, is reachable only from
the footer. The two pages were published three months ago and have almost no
links between them.

**What the term costs to win.** In the US results for "white label seo", the
pages that hold the top spots have real link equity pointed at those exact URLs:

| Rank | URL | Referring domains |
|---:|---|---:|
| 1, 3 | seoreseller.com/white-label-seo/ | 150 |
| 1, 4 | fatjoe.com/blog/what-is-white-label-seo/ | 20 |
| 2 | reddit.com thread | 6 |
| 6 | whitelabelseo.com/ | 381 |
| 8 | vulcanpoint.com/blog/best-white-label-seo-company/ | 4 |

A 4,500-word page with two referring domains does not beat a page with 150, no
matter how good the copy is.

**The terms themselves** (Ahrefs, US, current):

| Keyword | Volume | Difficulty | Traffic potential |
|---|---:|---:|---:|
| white label seo | 3,100 | 5 | 4,800 |
| white label seo services | 3,100 | 1 | 4,900 |
| white label seo agency | 2,100 | 30 | 2,400 |
| white label seo company | 1,400 | 27 | 6,400 |
| white label seo pricing | 600 | 1 | 250 |

**Everything we currently rank for in this family** (US): "white label seo
pricing" at 1 and "white label seo packages" at 20, both on `/pricing/`, plus
"the hoth white label seo" at 11 on the guide. That is the whole list.

---

## 4. The link leak

I swept every URL across seobrothers.com, seobrothers.co and seobrothers.ca that
still has live inbound links, then checked what each one returns today.

**183 linked paths. 54 of them resolve to nothing, stranding 567 referring
domains.**

The biggest single item is not the white-label hub:

| Path | Referring domains | Status |
|---|---:|---|
| `/industries/plastic-surgery-seo/` | 214 | 404 |
| `/resources/reparteemusic.html` | 195 | 404 |
| `/white-label-seo/` | 32 | 410 |
| `/resources/careers-hd.html` | 11 | 404 |
| `/index.php` | 8 | 404 |
| `/casl/slic/` | 7 | 404 |
| `/apply.php` | 6 | 404 |
| `/seo/private-blog-networks-pbn-hosting/` | 6 | 404 |
| 46 more paths | 88 | 404 |

The plastic surgery hub is the standout. It has 214 referring domains pointing
at a dead URL while `/guides/plastic-surgery-seo/` is live, has 186 referring
domains of its own and is one of our better-performing guides. The two should
have been joined at migration.

**Roughly half of the stranded links are not worth chasing.** The
`/resources/`, `/casl/`, `/index.php`, `/apply.php`, `/events.php`,
`/consumer/`, `/custom/` and `/wp-content/uploads/` paths belong to previous
occupants of the .co domain: a Canadian library association and a retail careers
site. Redirecting library-science links into SEO guides creates soft 404s and
signals nothing useful. Those stay 404 on purpose.

**What the fix in this PR recovers: about 295 referring domains** across 30
mapped paths, 225 of them on the plastic surgery family alone.

---

## 5. One thing to watch: the link profile

Live referring domains on seobrothers.com went from 459 in March 2026 to 970
now. Of the 593 gained since April, **434 look like junk**:

| Signal | Count |
|---|---:|
| `.shop` domains | 195 |
| `.store` domains | 131 |
| `.xyz` domains (17 of them purely numeric, e.g. `37486143.xyz`) | 58 |
| Gained since April with no dofollow link at all | 447 |
| Gained since April at domain rating 0 to 5 | 246 |

Anchor text on the worst of them reads "TELEGRAM @SEO_ANOMALY - SEO BACKLINKS,
BLACK-LINKS, TRAFFIC BOOST", "High Quality Dofollow Backlinks DA 50 PA 40
Premium PBN Network Service" and similar. Most are nofollow.

If nobody on the team bought links, this is scraper and negative-SEO noise of
the kind Google normally ignores. It is **not** evidence of a penalty and it is
not the reason the head term is missing, because the head term went missing when
the page was deleted. But it is a reason to open the manual actions report and
to consider a disavow file if the pattern keeps growing.

---

## 6. What I could not check

**Google Search Console for seobrothers.com.** All five Google accounts
connected to the platform were checked, including team@seobrothers.co. None of
them holds the seobrothers.com property.

That means I could not see impressions, average position over time, index
coverage, or **the manual actions report**, which is the only definitive answer
to "are we penalized". Everything above is inferred from third-party data and
live checks.

Granting team@seobrothers.co access to the property closes that gap and lets the
platform pull this data directly from then on.

---

## 7. Recommendation: one page, at the original URL

The question was whether to remove one of the competing pages and stick with
one, or pick one and improve it. **Consolidate to one, and put it back at
`/white-label-seo/`.**

Four reasons.

**The URL is the asset.** `/white-label-seo/` is exact-match, has a decade of
history, carries 32 live referring domains and is the URL that actually held
number one and number two. Rebuilding there recovers a position; building at a
new URL starts from zero, which is where the last three months went.

**The page that won was a hybrid, not a sales page.** The old hub carried
"Reseller vs Provider", "How to choose a provider", "Common pitfalls" and the
competitive comparison alongside the commercial sections. That matches the
memory of a long competitor-comparison deep dive. The restructure split that
single page into a commercial half and an educational half, and both halves are
weaker than the whole was.

**The current SERP rewards exactly that hybrid.** SEOReseller holds both 1 and 3
with a commercial URL at `/white-label-seo/` that opens with explainer content.
FatJoe holds 1 and 4 with a blog post. The results mix commercial and
informational intent, so a page that serves both outranks a page that picks one.

**Three pages at 0 and 2 referring domains is the worst available outcome.**
Nothing accumulates. Every link, every internal pointer and every mention is
split three ways.

### The shape of it

| Page | Action |
|---|---|
| `/white-label-seo/` | Remove the Worker route. Rebuild as the single money page, comparison-led, merging the services page and the guide. |
| `/white-label-seo-services/` | 301 into it. Three months old, 2 referring domains, nothing to lose. |
| `/guides/white-label-seo/` | 301 into it. Zero referring domains. |
| `/pricing/` | **Do not touch.** It ranks 1 for its term. |
| `/white-label-local-seo/`, `/white-label-link-building/`, `/white-label-ai-seo/`, `/white-label-web-design/` | Keep as supporting pages, each linking up to the money page. |
| Nav item "White Label SEO" | Repoint to `/white-label-seo/`. |

Then point links at it. The content work is necessary but it is not sufficient;
the gap between us and the top of that SERP is a link gap, not a word-count gap.

### The homepage

This fits the plan to make the homepage about the white-label brand as a whole.
The homepage should stop competing for "white label seo" and become what it is
best placed to be: the brand and positioning page, carrying 694 referring
domains and passing authority down to the money page. Who we are, how partnering
works, why it is stress-free, and the transparency and support story. It links
to the money page rather than duplicating it.

---

## 8. Action list

**In this PR**

1. Thirty legacy paths mapped to live destinations in `public/_redirects`,
   recovering roughly 295 referring domains.
2. Previous-occupant and scraper paths deliberately left as 404, documented
   inline so nobody "fixes" them later.

**Needs a decision or an action outside the repo**

3. **Remove the `wls-410-gone` Worker route** from the seobrothers.com zone.
   Until it goes, `/white-label-seo/` stays 410 and the redirect in this PR
   cannot fire. This is a deletion, so it is waiting on your OK.
4. **Grant team@seobrothers.co access to the seobrothers.com Search Console
   property**, so the manual actions report can be read and the platform can
   pull the data from then on.
5. **Decide on the consolidation** in section 7. It is a content project, not a
   config change, and it is the only thing that gets the head term back.
6. **Check manual actions**, then decide whether the junk link pattern in
   section 5 warrants a disavow file.
