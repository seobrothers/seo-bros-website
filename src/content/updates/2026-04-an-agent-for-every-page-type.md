---
title: "An agent for every page type"
publishDate: 2026-04-30
summary: "Late April 2026. Writing agents for geo, blog, service, location, expanded and ecommerce pages, a Business Profile post writer, citation ordering end to end, and a personal assistant with shared memory for every member of the team."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: workbench workflows added 04-22 (geo, blog), 04-27 (service, location, expand, ecomm product/category), 04-28 (page speed audit), 04-30 (GBP posts); citations commits 04-27; team-tools and remote assistants 04-20 to 04-27; keyword polling and project management 04-28/29; workbench-ops commits 04-20 to 04-30; portal PRs #179 #180 (04-20), #181 (04-23), approvals commits 04-27 to 04-30
left out: price in packages (money); per-user CLAUDE.md, VPS, memory service names (wiring and vendor); HR compensation history (internal HR); token usage summary
unsure: the ops dashboard is a separate internal app (workbench-ops). I described it as "an ops dashboard" without naming it. The HR directory is mentioned in one clause; cut if you would rather not.
edited: plain-language sweep: shared server, polling and spawn reworded
-->

If the first half of April was about what partners see, the second half was about who does the writing. By the 30th there was a writing agent for every kind of page we produce, and every person on the team had an assistant of their own.

## For our partners

The approvals page in the Portal was rebuilt and went live on the 30th. Approvals are grouped by campaign, each carries a due date, and a row opens where you would expect it to. The plan pages show how many notes a row has, and a monthly plan can be configured per campaign. Business Profile posts got their own page in the Portal on the 23rd, with the same approve and reject as content ideas.

The shared plan page shows scope against planned month by month, and carries your branding.

## Behind the scenes

The content-writing agent split into specialists. Geo pages and blog posts on the 22nd; service pages, location pages, expansions of existing pages, and ecommerce product and category pages on the 27th. Each reads the client's own site for voice and structure, reads the prior approved pages in the campaign so a new one fits alongside them, drafts, reviews its own draft against a checklist, scores it against optimisation targets, and saves a version for the team to read. The distinction matters because a service page and a blog post fail in different ways, and one prompt had been trying to avoid both.

A Business Profile post writer followed on the 30th, and a page speed audit that runs as a workflow on the 28th.

Citation ordering went end to end on the 27th. Locations are linked from the campaign, the business category is matched from the client's Business Profile, a description is written when the profile has none, the aggregators nobody wants are off by default, and confirming an order starts submissions immediately. The scan the provider runs before an order is imported so we know what already exists.

The team got assistants. From the 20th every member of the team had a personal assistant, with their own instructions and an "about me" section they maintain, shared memory they can add to and recall from, and a set of team tools: place search for finding a business's Google presence, site scraping and mapping, web search, spreadsheets, and historical keyword metrics. A knowledge base joined on the 23rd, and admins got the same assistant in the Workbench sidebar. Bulk task creation and task tools followed. This is the ancestor of the staff-side agents in the platform.

Keyword rankings began refreshing on a schedule, and project management tasks are created on their own. Content got an approved status distinct from published, a copy-share-link button, and a publisher assigned automatically.

An ops dashboard went up alongside Workbench between the 20th and the 30th, reading the same data: a resourcing view with task previews and threaded comments, carry-over of overdue tasks so they do not vanish at month end, a monthly pace that counts weekdays rather than days, planning grouped by partner with on-track campaigns collapsed, a content view, and drill-downs that match the numbers on the bars. An HR directory with document storage sits beside it.
