---
title: "Plans become tasks"
publishDate: 2026-03-31
summary: "March 2026. The separate plan record was folded into tasks, content-writing agents could be launched across many campaigns at once, and every partner got an agent of its own inside Workbench."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: workbench commits 2026-03-01 to 03-31 (plan-items-to-tasks merge 03-09, PRs #67 #68 #69 #70 #71 03-18/19, agent-server-v2 03-21 with 93 partner agents, link plans/gbp/content plan 03-25 to 03-27, removed plans route 03-20); portal PRs #158 #160 #161 #164 #166 #169 #170, commits 03-05, 03-16, 03-17, 03-20
left out: reports for the accountants, invoice print page, consolidation groups (billing); specialist and admin permission gating (security); IP-gated catalogue endpoints (security); page speed vendor name
unsure: "93 partner agents provisioned" is from a commit body and is a count, not a partner-identifying number; kept it. Cut if you prefer no numbers.
edited: cut the commit-count opener, the ninety-three count, the ten-days-later count, and the trickle-of-mismatches clause
-->

March was a month of structure more than surface. The plan item, a separate record since Workbench began, stopped existing. And the agents stopped being ours alone.

## For our partners

Not much of March shows on the Portal's surface, and that was deliberate: the plan pages were being rewired underneath to read from tasks rather than plan items, and the goal was that a partner would not notice.

What did show: an active conversations list, with actions available from it, so an agency with several threads open can work them from one place. Meetings can be recorded against a partner. When requesting a discovery you are asked which of your team should be involved. Discoveries no longer clutter the campaign list unless you ask for them. Files attached to a campaign are stored properly and open where you expect.

## Behind the scenes

On March 9 plan items became tasks. A plan item had been a row a partner approved, and a task had been the work that followed; keeping them in sync had been a job of its own. Now a task carries a planned status and a planned month, and the plan is a view of tasks. The edit dialogs in the plan views became slide-out sheets: instructions, planning notes, content details, link pairs. On the 20th the old plans route was removed. An unplanned task, we decided, is not a task at all.

Content tasks were consolidated into three views, Active, Publishing and Completed, and "due this week" started meaning the calendar week, which is what people meant when they said it.

The content-writing agent could now be launched in bulk: pick a partner, a planned month and a content type, and every matching campaign gets its own run. Each campaign row shows whether its last run is going, done or failed. Two more content agents joined on the 16th. Business Profile posts moved onto the same task model as content and links, with hover previews of the post, the offer dates and the call to action, and by the 22nd they no longer needed a planning step of their own.

The largest change of the month was partner-scoped agents. On the 21st each partner got an agent of its own inside Workbench: its own instructions, its own tools, its own memory and session history, reading only that partner's campaigns. By the 24th they were in the sidebar on the partner pages and the team could prompt several at once. The earlier agents had known everything about every client; these know one agency well.

Link planning got smarter prompts that only mention the months that need planning, delivery filtering, and automatic planning. A delivery rollup shows what was delivered against what was planned. Content planning and Business Profile planning got the same treatment on the 25th and 26th, and a content writing pass on the 27th.

Delegation arrived: a task can be handed to someone else with the context intact. An all-tasks view with custom saved views, a specialist tab, and clearer overdue indication rounded out the task work. The campaign links page gained a draft status and a comparison against scope. Page speed results can be pulled into the audit from a button.

In the Portal's shared inbox, conversations now suggest which partner they belong to by matching the email addresses, so linking a thread became a confirmation rather than a search.
