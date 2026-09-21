---
title: "Partners get logins and link building gets its own tool"
publishDate: 2025-04-30
summary: "Between February and April 2025 the Portal became a place a partner could actually log in and request a discovery, and the first internal tool, for our guest post publishing network, went from nothing to daily use."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: partner-portal 6a643ed, 4179878, e2ecbd2, d50bacc, f7c17ac, 675ecbd, 5a718cc, 6e71866, e41616d, 9c2db98, a954bf4, ca89a3f; execlinks repo Feb 4 to Apr 30 2025 (Initial commit, "Added front-end ... admin dashboard", "rebranded from Zelda to ExecLinks", "Added multiple workers", "added Ahrefs Updator Worker", "shadcn migration complete", "added the campaign route"); seocontent init 2025-04-18; execcontent init 2025-04-29
left out: staff view-as-partner (impersonation, Apr 25) as an auth feature; the sample payment page (Mar 12, not real); accounting and auth vendor names; the tool's internal name and its earlier codename
unsure: whether any partner contact was actually converted to a user in April, or only that the capability existed
edited: cut the two rebuilt-twice lines and the honest-summary framing
edited: plain-language sweep: workers became automatic checks, post pipeline became publishing flow, self-serve register button became public register button
-->

February to April 2025 is when the building stopped being a sketch. The Portal got real partner logins and a real first job. A second repository opened in February for the tool that manages our guest post publishing sites. Two more repositories for content work opened in April.

## For our partners

The Portal's first job was discoveries. On February 13 a partner with a login could see the list of discoveries we were producing for their prospects, and on February 27 the request form was built properly, so asking for one meant filling in a form instead of writing an email. On March 13 the team began updating a discovery's status inside the Portal itself, so what a partner saw was what our team had marked, not a status copied from somewhere else.

Logins were by invitation. The public register button came off on April 21, and from April 25 our team could turn a partner contact into a user directly. The team could also see which of its own people had login access and which did not. Every edit to a discovery was logged from April 24, so there was a record of who changed what.

In April 2025 the Portal was a discovery request desk with a dashboard in front of it. It was a real thing partners used, and the request form has been the front door for discoveries since.

## Behind the scenes

On April 14 we removed the accounting system integration from the Portal entirely and gave the Portal its own tables for partners, contacts and employees. That was the moment the Portal started owning data instead of reflecting it. "Admin" became "team" in the same change, which is the language we still use.

The bigger story in these months was the link building tool. Link building at our scale means running a large network of publishing sites, and until 2025 that ran on spreadsheets. The new tool started on February 4 as a registry of sites and networks, connected to each site through its standard publishing interface without a custom plugin, and grew a set of automatic checks from mid-March for site health, and by April those checks were pulling authority metrics and recording issues. By mid-April it had an issues table, a campaigns view and the beginnings of a publishing flow.

The first interface was built on one component kit in late February; by April 16 it had moved onto the same component library as the Portal. That switch mattered more than it sounds, because every tool we have built since shares that library, and it is a large part of why the later apps look like one product.

Two content repositories opened on April 18 and April 29. Neither had much in them yet. They were the first sign that content, like links, was going to get a tool of its own rather than a spreadsheet.
