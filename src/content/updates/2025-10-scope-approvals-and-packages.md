---
title: "Campaign scope, approvals and packages come to the Portal"
publishDate: 2025-10-31
summary: "October 2025: a campaign in the Portal became a list of scope items built from packages, a change to it became an approval the partner signs off on, and Workbench got its data model, tasks and time tracking while three side experiments were tried and set aside."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: partner-portal PRs #25 (Oct 13, plans, rules, approval requests, service items, packages, keywords), #26 (Oct 15 approval workflows with conversations), #30 (Oct 15 packages for ops), #33 (Oct 17 artifacts), #36 (Oct 27 cancelled route), #39 (Oct 29 onboarding form), #40 (Oct 30 scope changes, proration, credits), #34 (Oct 28 billing merge, nav hidden by c13cc1d); workbench Oct 16-21 (Drizzle, planning docs, "schema defined and repos built", "tasks and time"); seo-agents Oct 11-22 ("Ace agent started"), seo-ops Oct 22-30, seo-platform Oct 22-24
left out: billing (merged Oct 28 but nav commented out "for now", so not shipped); proration and credit mechanics (commercial terms); staff names in PR bodies; the analytics scraper worker
unsure: whether the Oct 15 approval emails went to partners in production that month or were exercised only by staff
-->

October 2025 was the month the Portal learned what a campaign is made of. Sixteen pull requests landed in eighteen days, most of them under the plain title "campaign work". In the same month Workbench went from an empty shell to a designed system, and three other experiments were started and stopped.

## For our partners

A campaign became a list of items. From October 13 every campaign in the Portal is built from sellable items grouped into packages, with campaign rules, guidelines and access details alongside. That structure is what made everything else this month possible.

Approvals arrived on October 15. When our team proposes a change to a campaign's scope, or needs a partner's sign-off on anything else, the partner gets an email and an approval in the Portal to accept or decline, and the conversation about it stays attached. On October 30 scope changes were rebuilt so a partner sees exactly which items change, for one period or several, before agreeing to anything.

Smaller things a partner would notice: notes on a campaign for reporting and publishing preferences, a reporting note on the partner record, files attached to a campaign from October 17, and a new onboarding form on October 29 for starting a campaign.

Billing did not ship this month. The first billing code was merged on October 28 and the billing link was removed from the partner menu the same day, marked "for now". We come back to it in December.

## Behind the scenes

The package and catalog work was for the operations team as much as for partners. A service catalog, sellable items, packages and campaign profiles gave the team one vocabulary for what a campaign contains, and by October 27 the campaign tables were pre-filtered with cancelled campaigns moved to their own page so a campaign manager's day-to-day view stayed short.

Workbench got its skeleton in one week. On October 18 we wrote down the design decisions. On October 20 the data model landed: tasks, task templates, task types, assignments, deliverables, approvals, artifacts, content assets and time tracking. On October 21 the task view was built out with notes, attachments and deliverables, and time entries, time off, timesheets and a schedule view arrived with it. Time tracking on day one was deliberate. Our specialists already logged time, and a work tool that ignored that would have been a second place to look.

October also had churn worth admitting. Between October 11 and October 30 three separate experiments were started: an agent framework with a chat interface and a prompt tester, and two further scaffolds for the internal tool. All three stopped within two weeks. Workbench is the one that continued, and the agent ideas from the first experiment came back inside Workbench in December, with a better home.
