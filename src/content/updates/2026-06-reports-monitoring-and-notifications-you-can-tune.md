---
title: "Campaign reports, monitoring, and notifications you can tune"
publishDate: 2026-07-05
summary: "June 2026 into the first days of July. Campaign reporting and monitoring arrived, tasks and initiatives became visible to partners, blog posts learned to link, and citations were reorganised around locations."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: workbench PRs #122 (06-05), #123 (06-09), #124 (06-18), #129 #130 (06-23); commits 06-05 to 06-14 (initiatives), 06-11 to 06-16 (AI rank checker, site auditor, tech audit, GBP auditor), 06-18 to 06-25 (keyword mapping), 06-24 to 07-03 (monitoring worker, alerts), 06-29/30 (reporting service, GA4); notification-hub 06-23 to 07-01; portal PRs #185 to #206 (06-03 to 06-30), commits 06-04, 06-23 (notification settings), 07-02 (communication settings)
left out: duplicate My Tasks rows and un-planning constraint fix (bugs, internal); team offboarding; the 1,102-row GBP sweep figure; provider and model names
unsure: whether the Portal reporting page was visible to partners on 06-30 or only wired (the PR says "updating the reporting data"; the Portal report itself was reworked 07-06 onward, which is the other writer's period). I said the page arrived, not that it was finished.
edited: cut the five-weeks count, the zero-links shortfall, the third-of-campaigns proportion and the-week-before; replaced first commit with first line of code
edited: plain-language sweep: endpoint, batched, backing off, rendering and payload reworded
edited: shaped
-->

June closed the Workbench era. Before the first line of the platform's code was written on July 6, Workbench gained the two things a campaign had never had in one place: a report on what happened and a watch on what might go wrong.

## For our partners

1. Tasks appeared in the Portal on the 9th: each campaign has an SEO task list, and task approvals sit with the rest. A task's share page was redesigned with the month it belongs to, a link to the campaign, a deliverables tab, and comments that reach the manager and the people assigned.
2. Initiatives followed on the 11th: a campaign's work grouped by the thing it is trying to achieve, each with its own shared page, notes and reactions, and approvals grouped the same way.
3. A reporting page arrived per campaign on the 30th, drawing on the same data the team sees.
4. From the 23rd an agency chooses its notifications: which kinds, by email or to a webhook, with a test send. On July 2 communication settings gained a campaign-level fallback and show who at the agency is assigned to what.
5. Content plan rows show status indicators and a note count, and approving a content idea is a cleaner step.
6. Offboarding campaigns stay visible under their own tab rather than disappearing, and organisation settings got their own page.

## Behind the scenes

1. Reporting arrived on the 29th and 30th: a report per campaign with period comparison across keywords, Business Profile, website analytics, crawl health and work delivered. Analytics connected once verification cleared.
2. Monitoring went live over the same days into July 3: checks on the homepage, the domain, the Business Profile and the crawl, raising alerts with an owner into a work queue.
3. Blog posts learned to link on the 9th. Before this, a person added the links.
4. Citations were reorganised around locations. Every citation now belongs to a specific location.
5. Three tools went up: an AI rank checker that tracks where a client appears in AI answers across several domains, a site auditor with a technical audit that does not need a full crawl, and a Business Profile auditor with reviews.
6. Initiatives arrived internally on the 5th with time tracking and reviews attached. Keyword mapping followed from the 18th, keywords mapped to the pages that should rank for them and linked to the content that targets them, with the crawl folded in, and campaign keyword research came on the 23rd.
7. Business Profile posts were tightened after a sweep of every post written so far: they had been landing at the bottom of the length band, so the target moved up, and images the platform rejects are filtered before upload.
8. One notification service took over sending from the 23rd: every notice goes through it, grouped, slowed when the email provider asks, and each email is built from the record of what happened.

### 3. Blog posts learn to link

The writer is handed an inventory of the client's live pages and previously published pieces, ranked by relevance to the post with a preference for the pages that make money, and scales how many it links to the length of the piece. External links are checked live and dropped if dead. Anything the writer invents, or that points at a staging copy of the site, is stripped before the draft is saved.

### 4. Citations by location

The provider's pre-order scan is imported and each listing scored field by field against the source of truth. Walled directories get a manual verification. Multi-location campaigns see the table grouped by location. Service-area businesses with no public address can be ordered too.
