---
title: "A shared plan page replaces the spreadsheet"
publishDate: 2026-04-16
summary: "The first half of April 2026. The campaign plan a partner sees became a live page on a link, on the agency's own domain if they wanted, and the Portal's monthly grid, focus pages and task views followed."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: workbench share-worker 03-31 to 04-14, PR #77 (04-02, planning route, work log, google sheet integrations), PR #73 (04-07), PR #78 (04-07), PR #86 (04-13), citations rebuild 04-07/08, leadership page 04-13; portal PRs #172 (04-02), #173 #174 (04-07), #175 #176 #177 #178 (04-14 to 04-16), commit 9ca83c9 "replace google sheet with sharable campaign plan link" (04-14)
left out: monorepo restructure and worker apps (wiring); MRR column (money); citation provider name; scope change indicator fix framed as a fix
unsure: whether webhooks were usable by partners on 04-07 or only wired; the PR says "integrations to webhooks" and "gate integrations for partners". I said webhooks appeared, not that partners were using them.
edited: reworded the we-have-called opener so it no longer points back at earlier posts
-->

Workbench and the Portal had been the beginning of the end for bulk spreadsheets. The end itself came in the first two weeks of April 2026. The monthly plan an agency received had been a Google Sheet. On the 14th the link that used to open that sheet opened a page.

## For our partners

The campaign plan became a shared page. One link, no login, generated live from Workbench, showing the plan by month with what is in scope against what is planned, and the client's locations on cards. On the 2nd the Portal's own plan management screens, the tabs, status cells and reject buttons built over the winter, were removed in favour of that link. Agencies who wanted the page on their own domain could have it there from the 7th. Webhooks appeared the same day, so an agency's other systems could hear about events without polling.

Inside the Portal, planning was rebuilt around the same model on the 16th: a monthly plan grid, location focus and page focus plans, Business Profile and SEO tasks, citations, content recommendations, and an approval banner where something needs a decision. Onboarding a campaign became a three-tab form, and a campaign can be onboarded straight from a package. A pending scope change now shows in the first full month after onboarding, where before it only showed the button to request it.

## Behind the scenes

The page optimisation work, where a specialist decides which of a client's pages get attention in which month, became a rolling twelve-month grid on the 13th. Pages are rows, months are columns, a checkbox assigns a page to a month and the task behind it is created or updated without anyone opening it. Completed months show a check that cannot be undone.

Citations were rebuilt around our citation provider between the 7th and 8th: a single card for connection, scan and orders, locations created from the client's Business Profile so the name, phone and category are right first time, and a status that says plainly when nothing is connected yet.

Content assets gained a published URL you can set from the table, a card for the images that go with a post, and a card for content instructions. Publishers stopped seeing a piece in My Tasks until it was approved. Reviewers got an internal review step before a draft goes to the partner. A location can be marked inactive without deleting it, so its history stays.

Workbench got a company documents section with a viewer role for people who should read but not edit. The leadership meeting moved into Workbench too: issues and opportunities with categories and owners, follow-up tasks, and a schedule.

A campaign got a work log, an SEO report, and a planning route that classifies every task by type. Some deliverables were still landing in spreadsheets in early April, and for those Workbench wrote the sheet directly. Onboarding and discovery became workflows in their own right on the 14th, and Portal events started reaching the team on their own: the first tells the sales channel when an agency onboards.

The agent in the sidebar became a conversation you can pick up on any page, and its history is kept.
