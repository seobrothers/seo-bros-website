---
title: "The Battery Problem Hiding Behind the AI Boom"
category: seo
publishDate: 2024-10-22
author: "Devon Bate"
summary: AI search and the broader AI buildout are driving data center electricity demand straight into a wall. The interesting question isn't whether the grid can keep up. It's what kind of batteries will hold it together when it doesn't.
featured: false
---

AI search is going to win the conversation about how the internet changes over the next five years. Google's AI Overviews are already pushing organic results down the page. ChatGPT and Perplexity are pulling queries that used to go to traditional search. There are a thousand SEO posts about it, including ours.

The conversation we're not having enough is what's powering all of it.

## The numbers are uglier than people realize

The International Energy Agency's January 2024 electricity report put global data center consumption at roughly 460 TWh in 2022, with a base case projection that it could roughly double by 2026. Goldman Sachs was louder a few months later, estimating in May that data center power demand could climb 160% by 2030 as AI workloads expand.

The US is the most concentrated version of the problem. Data centers consumed roughly 4% of total US electricity in 2023, and the trajectory points to close to 9% by the end of the decade if current trends hold. That growth is not spread evenly across the country. It is concentrated in a handful of regions where utilities are already telling new customers they cannot have power until the early 2030s.

Northern Virginia is the canonical example. The cluster known locally as Data Center Alley represents the largest concentration of data center capacity in the world, and Dominion Energy has spent the past two years warning that interconnection queues are full. Then in July 2024, a protection system fault caused around 60 data centers in the region to drop off the grid simultaneously and transition to backup power. Frequency on the regional grid swung sharply enough that PJM had to issue an alert.

That's a preview, not an anomaly.

## What lithium is and isn't good for

The default battery chemistry for nearly everything we plug into the grid right now is lithium-ion. It's the chemistry powering the EV transition, behind-the-meter storage at homes, and most of the new utility-scale battery installations going in next to solar farms.

Lithium is good at what it does. Energy dense. Mature manufacturing. Cost curves that have come down for over a decade.

It is also the wrong tool for several jobs the AI infrastructure buildout needs done.

Lithium-ion has a fire risk problem. Thermal runaway events at utility-scale lithium installations have been bad enough that several jurisdictions have written setback requirements that make them hard to site near anything important. Data centers, full of densely-packed expensive equipment, are exactly the kind of "anything important" you would not want a thermal event next to.

Lithium also doesn't love long durations. Most installations are sized for 2 to 4 hours of discharge. For data center backup that's plenty if the grid comes back. For the kind of multi-day reliability some operators are now planning for, you need something else.

And the supply chain is what it is. Lithium, cobalt, and the rest of the cathode supply chain run through countries and refining capacities that the US and Canada have decided over the past two years they want less reliance on. That's a policy story, not a technical one, but it shapes what gets funded.

## The alternatives are no longer hypothetical

A few years ago, "alternatives to lithium-ion" was a venture capital pitch deck phrase. In 2024 it's a list of commercial deployments.

[Eos Energy](https://www.eose.com/) builds zinc-bromide flow batteries and announced in mid-2024 a financing package of up to $315 million from Cerberus to scale manufacturing in Pennsylvania. They're targeting the 4 to 12 hour duration window that lithium handles awkwardly.

[Form Energy](https://formenergy.com/) is building iron-air batteries designed for 100-hour duration. They have signed deployment agreements with utilities in Minnesota, Georgia, and California, and Dominion in Virginia is piloting an iron-air installation specifically as a lithium alternative for grid reliability.

[ZincFive](https://zincfive.com/) builds nickel-zinc batteries designed for short-duration high-power applications, including UPS systems for data centers. Vertiv, one of the largest data center infrastructure vendors in the world, started integrating ZincFive's BC Series cabinets into its product line in 2024.

[Urban Electric Power](https://www.urbanelectricpower.com/) builds zinc-manganese-dioxide batteries already running at the San Diego Supercomputer Center, with additional long-duration storage pilots underway in New York. The chemistry is non-flammable, which is exactly the property data center operators want in the equipment racks below their servers.

And [Salient Energy](https://salientenergy.ca/), a Canadian company spun out of research at the University of Waterloo, is developing water-based zinc-ion cells. Their pilot plant in Dartmouth, Nova Scotia is set up to produce the first UL-tested zinc-ion battery, with grid storage as the lead application. Of the chemistries on this list, it's the one we know best, because they're working out of our backyard.

The common thread isn't that any of these technologies is going to wholesale replace lithium. Lithium is going to keep doing what it's good at. The thread is that the diversity of what gets deployed at scale over the next five years is going to be a lot wider than it has been over the last five.

## Why this matters for anyone reading an SEO blog

The honest answer is, it doesn't, directly. If you're optimizing a page for "best plumber in Halifax" the battery chemistry that powered the data center that served your visitor is not on your list of concerns.

But it should be on the list if you're trying to figure out what the internet is going to look like in 2030.

Search is going through a generational shift. AI Overviews are the visible part. The invisible part is the compute spend underneath them. Every query that triggers an Overview now also generates a synthesized answer on top of the standard indexing work, and that costs orders of magnitude more electricity to produce.

We don't know what the second-order effects of that are going to be yet. Maybe AI Overviews get capped on certain query types because the unit economics don't pencil out. Maybe Google starts charging for richer AI experiences. Maybe energy constraints push the entire industry toward smaller, more efficient models that don't require massive inference clusters.

We pay attention to this because what gets answered, where, and at what cost is the next decade of search. The battery story is one of the leading indicators.

## How we approach this at SEO Brothers

We're a technology-first SEO company offering [white label seo](/white-label-seo/) to agencies and growth-focused operators. That means we read the energy and infrastructure stories alongside the search algorithm stories, because the two are converging faster than most operators in our industry have noticed.

If you're trying to make sense of how AI search is going to reshape your traffic, your acquisition costs, or your content strategy, [get a free audit](/tools/free-seo-audit/) and we'll walk you through what we're seeing.
