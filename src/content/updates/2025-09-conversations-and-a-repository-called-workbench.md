---
title: "Conversations in the Portal, and a repository called Workbench"
publishDate: 2025-09-30
summary: "August and September 2025: partner email threads showed up inside the Portal against the campaign, discoveries got structured research tables, and on September 20 the Workbench repository was opened."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: partner-portal 78b7a46, 091671e (Aug 4), 6ac614a (Aug 7), ab0ae4a (Aug 14), PRs #22 #23, 00653c7, 21d624d (Sep 2), 47edff7, 4b26c24 (Sep 8), e1cce36, 6510a08 (Sep 3-5 discovery automation), 9a237aa (Sep 18), 9e0c761 (Sep 19 billing and org scaffolding); workbench 3044d11f (Sep 20 initial commit) through Sep 23 "migrate to pages off workers"; wb-api Sep 22; execlinks last commit Jul 23
left out: the shared inbox vendor; per-staff inbox tokens (credentials); billing scaffolding as anything visible (it was not); hosting model change
unsure: whether partners could reply from inside the Portal in September or only our team could send; record shows sending by staff with a saved inbox token
edited: cut the day and week counts (first four days, fifteen days before, eleven weeks) and the in-this-chapter-only-because aside
edited: shaped
-->

August and September 2025 were two months of the Portal getting more useful to the people who talk to partners every day, and one weekend in September when a new repository was opened for the tool our own team would work in. This is the point where the two-app design became real rather than drawn.

## For our partners

1. Conversations. From August 7 the email threads between a partner and our team appeared inside the Portal, attached to the campaign they were about.
2. Discoveries got more substance. From September 3 a discovery in the Portal held the research, not a link to a document that held the research.
3. Each campaign got a named campaign manager and account manager from August 4, visible on the campaign.

### 1. Conversations

The most recent message opened by default from August 14. From September 2 our team could send a message from the Portal itself, so a reply and the record of the reply were the same thing. On September 8 a campaign gained its own contacts, so it was clear which people at a partner belonged to which client's work, and email links opened straight into the thread.

### 2. Discoveries

On September 3 the discovery record was split into proper fields, and over the next two days the team side gained a keyword opportunities table, a supporting data table and inline editing. By September 18 that work was called done.

## Behind the scenes

The Workbench repository was created on Saturday, September 20, 2025. It began with the plain necessities: production sign-in, a stable database connection, the app shell and sidebar. Nothing in it did anything yet. But its README said what it was for, an internal tool for our specialists to do their work, paired with the partner-facing Portal, and that sentence is still accurate.

Two details show the design was already joined up. On September 5 the Portal's discovery table gained fields for crawl data that would come from Workbench, before Workbench existed. And the link tool, whose sidebar had promised a Workbench in June, saw its last change on July 23. Its ideas moved; the repository did not.

On September 19, the day before Workbench began, the Portal got scaffolding for billing and organization settings: a billing page, an invoice list, an invoice detail view, and empty pages for payment methods, profile and team. None of it was visible to a partner and none of it worked yet. It marks the start of the billing build, which shipped in December.
