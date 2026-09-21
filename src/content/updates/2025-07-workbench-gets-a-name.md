---
title: "Workbench gets a name and the Portal learns campaigns"
publishDate: 2025-07-31
summary: "May to July 2025: the link tool became the first section of something called Workbench, a content app with drafts and feedback went to the writing team, and the Portal was refit around campaigns, partners and the people at each."
author: "Devon Bate"
span: chapter
draft: false
---

<!-- review
sources: execlinks 192a04d (May 1), 98dc5bf (Jun 11 link reporting), 22129d9 (Jun 15 "preparing sidebar for workbench", link-plan-agent scaffold), 76edfc9 (Jun 23 bulk processing), Jun 25 publishing filtering; seocontent Jul 15-18 ("content app", feedback, optimisation score polling, page fetching fixes); execcontent May 5-6, Jul 21 "partner package"; contentwb May 11; partner-portal 5bfb970 (Jun 11), 7d38f53 (Jun 30 CRM refit), 9035a89 (Jul 2), 9d6fdb9 (Jul 25), 674f225 (Jul 29), 4f2fe2f (Jul 30)
left out: the content scoring and page fetching vendors; a staff member's name in commit subjects; partner logos committed to the repo (identifying); the execcontent "partner package" mockup (never shipped as such)
unsure: whether the link planning agent scaffold ever ran against real data; treated as a prototype
edited: cut the chapter-covers opener, the one-large-change and four-days framing, and the fourteen-commits line
-->

May, June and July 2025 is the period where the internal tooling stopped being one tool and became a plan, the word Workbench first appeared, and the Portal was rebuilt around the objects our business actually runs on: partners, the people at each partner, and their campaigns.

## For our partners

The Portal gained campaigns. On June 30 the data underneath it was refit so that a partner has contacts, contacts have roles, and every client engagement is a campaign with its own page. The campaign page had tabs for conversations and billing from that day, even though both were empty. By July 29 our team could edit a campaign's details, and from July 30 keep notes on it that a partner could read.

On July 25 the team side got full editing for employees, partners, partner team members and onboarding. Most of that was for us, but it meant a partner's list of people in the Portal was finally maintained in the Portal rather than in a spreadsheet.

None of this was a live view of work yet. Campaign details were typed in by our team. What a partner got was a tidier and more truthful account of what they had with us.

## Behind the scenes

On June 15 the link tool's sidebar was rebuilt with new sections: content, partner management, sales discovery, SEO work, strategy. All of them were placeholders except links, and the work was labelled as preparing for Workbench. That is the first time the name appears in the record. The idea was already clear: one internal tool where every kind of work lives, with links as the first finished room.

The same day brought the first agent we ever wrote, a link planner meant to draft quarterly and monthly plans and take feedback from the team. It was a prototype in a folder and it did not become the agent we run today, but the shape of it, a plan an agent drafts and a person corrects, is exactly the shape we ended up with.

The link tool itself got a complete interface overhaul on June 10, link reporting on June 11, a way to handle sites with issues in bulk on June 23 including a small plugin for updating posts on many sites at once, and publishing filters on June 25. The data still lived elsewhere: the tool wrote link results back into spreadsheet tabs, and by May 1 it was syncing to the cards on our task board. The new tool fed the old systems of record. That was the right call at the time, and it is also why the spreadsheets did not disappear for another year.

Content got its own app in July. From July 15 the content repository became a working tool: a content asset with a brief, a draft, a feedback loop with the writer, and automatic polling of optimisation scores so a writer did not have to check by hand. The team's feedback shaped it from the first day of use.
