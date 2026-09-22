---
title: "Workbench goes to work and the Portal starts talking to it"
publishDate: 2025-11-30
summary: "November 2025: Workbench was deployed to the team with tasks, plans, a work log and time, the existing campaign book was imported, and a discovery or onboarding requested in the Portal began creating the work on our side without anyone copying it."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: partner-portal PRs #41 (Nov 3 discoveries into the portal-workbench queue), #42, #43 (Nov 4 temporary billing agreement route for data migration), #44-#47 (Nov 5-6 CSV importer), #48, #49 (Nov 10 order syncing), #57 (Nov 20 task board card on edit form), #59 (Nov 22 approval marks deliverable approved in Workbench), #60 (Nov 24 queuing campaign onboards); workbench d8789853 (Nov 14 ready for deployment), 93524423 and 0e6dc9a2 (Nov 18 plans, work log, keyword tracking), 9fe8b2fd (Nov 21 approval requests, onboarding), 4d740790 (Nov 23), 9845bd4c (Nov 24 discovery handling forwards to task board and duplicates a sheet), f5444e23 (Nov 26 SOPs), 55422490 (Nov 27 meetings), 043eab0a (Nov 28 sidebar, issues)
left out: billing branch work Nov 14-18 (invoice, payment, autopay; unmerged); the order platform and meeting transcript vendors; impersonation (Nov 28); permissions commits; internal queue and worker names
unsure: whether the whole team moved onto Workbench on Nov 14 or a subset; the record says "ready for deployment" and "deploying", not who used it
edited: cut the commit counts, the same-honesty and worth-recording asides
edited: plain-language sweep: migrate became bring across, ready for deployment became went to the team
edited: shaped
-->

November 2025 is the month Workbench became a place people worked rather than a plan, and the month the Portal and Workbench started handing things to each other. Almost none of it was visible to a partner, and almost all of it changed what happened after a partner clicked.

## For our partners

1. A discovery requested in the Portal began creating the work on our side automatically on November 3, where before someone read the request and set up the job by hand. From November 24 the same was true of a new campaign: onboarding it in the Portal set up the campaign in Workbench, with the partner's own discovery template attached.
2. Approvals closed the loop the other way. From November 22, when a partner approved a deliverable in the Portal, the deliverable was marked approved where our team was working on it, and no one had to tell anyone.
3. Conversations got quieter improvements: threads linked to their campaign automatically from November 7, replies from our support address shown as coming from us, and from November 18 a conversation shows its status wherever it is linked.

## Behind the scenes

1. Workbench went to the team on November 14 with tasks, quick tasks, task templates, employee skills and roles, support requests and time entries, and over the rest of the month it grew the pieces a campaign actually needs.
2. The book came across on November 5. A CSV importer brought the existing campaigns into the Portal, and both systems ran side by side, on purpose.
3. Discoveries worked the same way from November 24: a request Workbench received was set up in Workbench and in the old systems both, so whichever a specialist opened, the work was there.
4. A temporary team-only page on November 4 for entering billing agreements let us bring the existing book's agreements across before billing shipped. It was scaffolding for December.

### 1. Workbench goes to the team

Plans landed on November 18, where a campaign's monthly scope becomes a list of plan items by type, and a work log the same day, so every piece of work done on a campaign is recorded against it. Keyword tracking tables landed alongside. Task templates gained rich text procedures on November 26, so the how-to lives inside the task. Meeting transcripts were attached to partner records from November 27. A new sidebar with an issues view came on November 28.

### 2. The book comes across

The import included each campaign's service frequency and, tellingly, the id of its card on our task board. On November 20 that card got a link on the campaign edit form.

### 3. Discoveries in both systems

Workbench created the Workbench task and deliverable, and it also forwarded the request to the task board and duplicated the research spreadsheet. This is what the beginning of the end of the old systems looked like in practice: the new tool did everything the old ones did, in parallel, until it was safe to stop.
