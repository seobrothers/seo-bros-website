---
title: "Link building comes inside Workbench"
publishDate: 2026-01-31
summary: "Late January 2026. The link building tooling moved into Workbench, every campaign got a scope catalogue, and the first shareable campaign plan pages went out."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: workbench commits 2026-01-19 to 01-31 (execlinks 01-19 to 01-29, onboarding/offboarding and link workflows 01-23, campaign assignments 01-26/28, scope items 01-28 to 01-31, share/campaign-plans 01-29/30, content views 01-30/31); portal commits 01-20 (discovery delivery, packages launch form), 01-27 (team view, profile completion), 01-29 (self-pay, URL filter), 01-30 (confirm buttons)
left out: billing agreements, invoices, void, tax, wallets, manual payments (billing); ssh terminal detail (wiring); "value per content" column (money)
unsure: whether to keep the one sentence on partners paying invoices themselves (billing, but partner-facing and not a commercial term). Cut if you disagree.
edited: replaced the ten-days and two-days-later counts with the month and the date
edited: plain-language sweep: migration page reworded
-->

The second half of January had two threads. One was pulling the last outside tool, our link building system, into Workbench. The other was deciding, in data rather than in someone's head, what a campaign actually includes.

## For our partners

The Portal gained a Team page listing the people at the agency who have access to the account, and new agencies were asked to complete their profile before going further. Campaign lists could be filtered by the client's URL. Buttons that do something irreversible now ask first.

Discoveries changed hands faster. When the team finished an audit, the delivery email went out from the Portal itself and the campaign's status updated in the same motion, rather than someone writing the email and someone else updating the record. The packages page and the launch form, the place a partner starts a campaign from a discovery, were tidied: a start date, a proper confirmation, and no launch without a selection.

Partners with billing access could settle their own invoices from the Portal at the end of the month.

The first shareable campaign plan pages appeared on the 29th. A link, no login, showing a campaign's plan the way the team saw it. They were rough and they were mostly sent by hand. They were also the start of the thing that would replace the spreadsheet in April.

## Behind the scenes

The link building tool had lived in its own application since 2025. By the end of the month it had come inside: the sites, the servers, the plugins, the networks, the issues list. Managing the servers moved inside with it, so a specialist could fix a site without leaving the page they were on. Link tasks started running as an automated workflow on the 23rd, and link reporting followed on the 25th. Terminated sites dropped out of the lists so nobody would build on one by mistake.

The same day the link workflow landed, campaigns got onboarding and offboarding workflows: when a campaign starts, the first month's tasks are created; when it ends, the close-out tasks are. Routine tasks started being added to the queue without anyone creating them.

Scope items arrived on the 28th. Until then, what a campaign included was a package name and whatever the manager remembered. Now each campaign carries a catalogue of items with quantities, packages are built from the same items, and a partner's own variations are recorded against it. Tasks were classified by type at the same time, and the SEO work split into on-site, on-page and technical queues. This is dry work and it is the foundation for everything that compares planned against delivered later in the year.

Assignments were reworked so a manager could assign specialists to campaigns in bulk, and notifications went out on assignment. Content got its own views: content tasks, content campaigns, a team resourcing page, a new-content task route, editable content types and templates, and a proper rich text editor. Content optimisation scoring was integrated on the 28th. Discoveries could be downloaded as a CSV.

The page for walking campaigns out of ClickUp saw its last real use in the final week of the month, sorted by what was not yet complete until nothing was.
