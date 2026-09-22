---
title: "Billing arrives in the Portal"
publishDate: 2025-12-19
summary: "On December 4, 2025 the billing build that started in September landed: invoices, statements, receipts, payment methods and autopay in the Portal. In the same weeks discovery editing and tasks left the Portal for Workbench, and campaign scope became a timeline."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: partner-portal PR #63 (Dec 4 billing mega merge), Dec 5 commits 4a8e1a0 56fcb9e 81d31c0 9d129f9 9e41ec7 a7fc84b d9eab19, #64 (Dec 9 discovery editing removed, offboard form, business profile and competitor selectors), #65 (Dec 10 SOP and task tables dropped), #66, e043b88 (Dec 10) and c3b2850 (Dec 11 billing agreement views), #67 (Dec 11 permissions to approval requirements), #69 (Dec 16), #70 and #71 (Dec 19 scope timeline, campaign rules form, access items). Partner nav at year end: Dashboard, Discoveries, Campaigns, Approvals, Conversations, Billing (permission gated), Organization settings
left out: payment processor name; prices, currencies, autopay mechanics beyond existence; wallet sync and failed-transaction fixes described as fixes; login URLs on access items (credentials)
unsure: how many partners had the billing permission switched on by Dec 31; the record shows the menu item gated by permission, not who had it
edited: cut the eleven-weeks and hidden-for-five framing, the fixes-dated line, the lines-of-code count, and the correction-to-our-memory aside
edited: shaped
-->

December 2025 in the Portal is two stories. The first is billing, which had been under construction since September 19 and landed on December 4. The second is the Portal shedding work that belonged in Workbench, so that by the end of the month the Portal was the partner's window and Workbench was the workshop.

## For our partners

1. Billing. From December 4 a partner with billing access has a Billing section in the Portal: invoices with their status, a statement, receipts, payment methods on file with a default card, and autopay.
2. Scope became a timeline on December 19: a campaign's details page shows what the campaign includes quarter by quarter, and a proposed change appears as proposed, without moving anything, until it is approved. Campaign rules, the standing instructions our team follows for a campaign, got their own form the same day.
3. Approval requirements replaced the old permission settings on December 11. For each campaign a partner can say which kinds of work need their sign-off before it goes out and which do not.
4. Campaigns show their agreement. From December 10 a campaign's page shows the billing agreement behind it, and from December 11 a partner can see all of their agreements in one place.
5. The discovery request form improved on December 9: a partner picks the prospect's Business Profile from a search and chooses competitors from a list rather than typing either.

### 1. Billing

Organization settings gained the partner's contact details, address and team on the same day. Over the next day the details were tightened: invoices due today no longer show as past due, a failed payment says so plainly, and every page got a proper title.

## Behind the scenes

1. Billing was built in stages: scaffolding on September 19, the first real code merged on October 28 with the menu link kept out of the partner menu, invoice, payment and autopay work through November, and the whole thing merged on December 4. The date it shipped owes a lot to the temporary agreement entry page from November that let us load the existing book before the switch was turned on.
2. The Portal got smaller in December, deliberately. Every removal was a place where two systems could have disagreed, gone.
3. A team-only offboarding form arrived on December 9, so ending a campaign is a recorded process rather than a series of edits.

### 2. The Portal gets smaller

On December 9 all discovery editing, the audit, keyword, local and proposal editors, left the Portal; that work is done in Workbench now and the result is shared back. On December 10 the Portal's own task and procedure tables were dropped, because Workbench had owned tasks since November.
