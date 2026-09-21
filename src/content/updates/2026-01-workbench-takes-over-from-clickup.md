---
title: "Workbench takes over from ClickUp"
publishDate: 2026-01-18
summary: "The first half of January 2026. The last of the campaign record left ClickUp for Workbench, and the first internal agents started working on it."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: workbench commits 2026-01-01 to 2026-01-18 (agents 01-06, campaign data tools 01-09, ClickUp comment/data migration scripts 01-13 and 01-16, ops campaign-migration page 01-16), agent seed migration 2025-12-23, portal PR #73 (hidden), #75
left out: portal campaign plan routes (merged hidden "for now"), onboarding address/currency (billing), generate-plan-items (hidden again 01-21)
unsure: the exact day the last ClickUp campaign came across; migration page work runs 01-16 to 01-28 and a first wave of 71 campaigns moved in Nov 2025 per a later commit
edited: cut the quick-push commit line, the three-days-later count, and the needed-for-a-long-time clause
-->

January 2026 was the month the team stopped living in two places. Campaigns had been moving into Workbench since November; in the first two weeks of the year the rest of the record followed, and the first agents went to work on it.

## For our partners

Little moved on the surface of the Portal in the first half of January. The discovery lists, where a partner watches a requested audit go from requested to delivered, gained sorting that held across pages and a status filter, so an agency with several in flight could find the one they wanted.

Everything else that month was underneath.

## Behind the scenes

The end of ClickUp came in two steps. A first group of campaigns had moved into Workbench in November. What remained in January was the history: years of task comments, attachments and notes that the team still opened ClickUp to read. We wrote the migration for comments on the 13th, the rest of the data on the 16th, and put a migration page in Workbench the same day so each remaining campaign could be walked across and its notes synced by hand, one at a time, with a checklist. That page stayed busy until the last week of the month. After that there was no reason to open the old tool.

The agents arrived the same week. Since late December Workbench had held three: a campaign chat you could ask about any client, an SEO planner that drafted the month's on-site work, and a link planner. On January 6 they became something the team could actually run. Every agent run got a name and a manager, a person responsible for reading what it produced. Feedback on a run could be filed against that run or against the agent as a whole, so a correction made once applied to every campaign. The team got push notifications, on their phones if they wanted, when an agent finished or a task was assigned.

On the 9th the agents got their first real tools: they could read a client website's page inventory and update it, setting a page's type, its anchor keyword and whether we monitor it. That sounds small. It is the difference between an agent that talks about a plan and one that can act on the record.

Underneath the agents, the plan itself changed shape. A plan item, the unit of work a partner approves, now turned into a task with steps on its own, and finishing the task marked the plan item done without anyone touching it. Bulk planning let a manager lay out several months of items for a campaign at once. Locations became a first-class part of a campaign, which matters most for multi-location clients. And a discovery, the audit we run when an agency brings us a prospect, started running as a sequence of automated steps rather than a checklist someone remembered.

None of this was polished. But by the 18th a campaign lived in one place, its history came with it, and three agents could read it.
