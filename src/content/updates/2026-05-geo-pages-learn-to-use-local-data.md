---
title: "Geo pages learn to use local data"
publishDate: 2026-05-31
summary: "May 2026. The writing agents were tuned on partner feedback (shorter commercial pages, no bolded keywords, no filler sections), geo pages gained researched local data blocks, and campaigns got monitoring and search data connections."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: workbench PRs #103 (05-01), #107 (05-12), #114 (05-26), #115 (05-28), #116 (05-28), #117 (05-29); commits 05-05/08 (gbp posting, stock image fallback), 05-08 to 05-11 (dashboard, work route, mobile), 05-11 and 05-14 (sitemap/robots and profile review workflows), 05-19 (campaign monitoring), 05-21/22 (GA4 + Search Console integrations, GSC scope re-enabled), 05-21 (share-worker live branding); workbench-ops 05-08; portal commits 05-04, PRs #182 #183 (05-11), 05-20, 05-26 (webhooks)
left out: adhoc invoices, tax report, month-by-month report (billing); per-partner auto-approve of GBP posts (names a partner); model names and temperatures; "no more crawler" (unclear what was retired)
unsure: "one partner told us" is from the PR body (a named partner, generalised). The length figures (three to four times) are from the same body. Cut the numbers if too specific.
-->

May was the month the writers got edited. The agents built in April had been producing pages for a few weeks, partners had read them, and the feedback was specific enough to act on.

## For our partners

Approvals moved onto the dashboard on the 4th, so what is waiting for you is the first thing you see. On the 11th the approvals page and the plan pages were made to agree: an idea counts as approved when you approved it, not when the team happened to move it forward, and a post without a planned month no longer appears as if it needs a decision.

Webhooks can be tested with a sample message from the settings page. Discovery filters remember themselves. Text areas grow as you type. The shared plan page reads your branding live, so a logo change shows the next time the link is opened.

## Behind the scenes

On the 1st we lowered the length floors. One partner told us their April geo pages had come in at three to four times the length of the rest of their site, which does not fit the site and reads as stuffing. The geo page writer had carried a floor meant for blog posts. It now matches the length of the client's existing pages and falls back to roughly eight hundred words, and the service, location and ecommerce category writers got the same treatment. An explicit instruction against padding went into all four.

On the 12th, three more rules across all seven writers: no bolding the keyword (optimisation should be invisible to the reader), no closing section that names cities or services the page does not target, and nothing carried over from the client's site that is not prose (no embeds, forms, images or widgets scraped from the homepage). Each rule got a matching check in the review step.

Business Profile posts fall back to a stock image when the client's site has none we can use. A sitemap and robots review became a workflow on the 11th, and a Business Profile review on the 14th.

The bigger change came at the end of the month. Geo pages, the city-by-city pages a local business needs, started using researched local data: demographics, housing, market segments, competitor density, each figure cited to a source and never invented. The first attempt on the 26th added a data block to a finished page, and it read as bolted on because the prose had not been written knowing the data was coming. On the 28th we rebuilt it so the research happens first and the writer gets a small library of blocks (a comparison chart, a stat row, a callout) to place inside the narrative, with a setup paragraph before each and a bridge after. The palette takes its anchor from the client's own brand colour, read from their site. Pages in the same campaign also stopped converging on each other: the writer now reads what the prior pages covered, commits to distinct angles before drafting, and keeps the heading pattern consistent while the body diverges.

Each campaign got a work page, the dashboard was redone, and tasks and campaigns became usable on a phone. Campaign monitoring started running on the 19th. Search Console joined Business Profile as a connection a campaign can make on the 22nd; Analytics followed once verification cleared in June.

The ops dashboard gained a campaign planning page and started showing content pieces, not tasks, in its bottleneck views.
