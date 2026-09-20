---
title: "The Portal starts as a sketch"
publishDate: 2025-01-31
summary: "In October 2024 we opened a repository for an agency-facing portal, drew a dashboard, wired up sign-in, and then mostly left it alone for three months while the service business ran."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: partner-portal commits 34c2a4f, 6dfb115, 6070dba, 66c8e09, 9e4da38, 240b321, 8c02102, b620075, 5c7079f, 531991e, 378caa1, 643d736 (2024-10-03 to 2025-01-08)
left out: auth vendor, accounting system vendor, framework upgrade details
unsure: whether anyone outside the two of us ever opened this build; the record has no partner user until April 2025
-->

This chapter covers October 2024 through January 2025, the four months in which the Portal existed only as a repository and an idea. Twenty two commits in total, fourteen of them in the first month. It is the quiet start of everything that came after.

## For our partners

Nothing yet. No partner logged into anything we built during this period, and working with us still meant email, calls and spreadsheets. What was decided in these months did shape what partners eventually got, so it is worth recording.

The first two days, October 3 and 4, 2024, produced a placeholder app, a logo, dark mode, a dashboard mockup, a campaigns page with nothing behind it, and a sign up page that went nowhere. By October 16 there was sign-in, protected pages that bounced you to it, and a decision that has held ever since: two separate dashboards, one for a partner and one for our team, in the same app. The partner never sees the team's view and the team can see everything.

## Behind the scenes

The build was a sketch made between client work, and it looks like one. November has two commits, both editor and preview configuration. December has three, the largest of which fleshed out a few pages and added code to talk to our accounting system, because at the time the accounting system was where the record of a deal actually lived.

The first real object in the Portal was the discovery: the research report we produce on a prospect before an agency pitches them. On January 8, 2025 the team side got a bare list of discoveries, with each one's status read from the accounting system rather than kept in the Portal. That was the honest state of things. The Portal did not yet own any data. It was a window onto systems that already existed.

Two other choices from this period stuck. The app was built on the same component library and framework we still use, upgraded to the stable release at the end of October, and every list in the Portal has been a sortable data table since the starter for it landed on October 29. Neither was a big decision at the time. Both saved us from rebuilding later.

Looking back, the slow winter was not a failure of will. We had a service business to run and no one whose job it was to build software. The Portal picked up again in February, and the pace did not drop after that.
