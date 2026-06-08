---
title: "Interaction to Next Paint (INP): What Replaced FID and How to Optimize for It"
category: seo
publishDate: 2025-02-13
author: "Adam Bate"
updatedDate: 2026-04-30
summary: INP replaced First Input Delay as a Core Web Vital in March 2024. A complete guide to what it measures, why it's stricter than FID, the thresholds that matter, and the optimization tactics that move sites from failing to passing.
---

Interaction to Next Paint replaced First Input Delay as a Core Web Vital in March 2024. The transition is complete, the metric is live in Search Console, and the reports we've seen across client sites show that many sites that quietly passed FID are now failing INP.

This guide covers what INP measures, why the new metric is stricter, how to read field data versus lab data, and the practical optimizations that move pages from failing to passing.

## What INP measures

INP measures the time between a deliberate user interaction (a click, a tap, a key press) and when the resulting visual change appears on screen. It doesn't measure passive interactions (hover, scroll). It measures the actions where the user expects feedback.

The metric reports the worst experience users had on the page during their session, not the average. If 99 of 100 interactions were fast and one was slow, INP reports the slow one. This matters because the worst experience is what users remember.

Three components contribute to INP:

1. **Input delay** before the browser starts processing the event
2. **Event handler processing time** while JavaScript runs
3. **Presentation delay** between the handler completing and the browser painting the result

FID only measured the first of these, on the first interaction. INP measures all three, on every interaction.

## Why INP is stricter than FID

A few specific reasons sites that passed FID are failing INP.

**FID only measured the first interaction.** A page where the first click was fast but every subsequent click was slow passed FID. INP catches the slow subsequent clicks.

**FID didn't measure event handler time.** A page that responded immediately to the click event but then took two seconds running JavaScript before updating the UI passed FID. INP catches the JavaScript bottleneck.

**FID didn't measure rendering delay.** A page where the JavaScript completed quickly but the resulting DOM update took a long time to paint passed FID. INP catches the rendering bottleneck.

The cumulative effect is that INP reflects what users actually experience, not just one optimized first-interaction moment.

## The thresholds

Google's published thresholds for INP:

- **Good**: 200ms or less
- **Needs improvement**: 200ms to 500ms
- **Poor**: above 500ms

The Core Web Vitals pass criterion is that 75% of page loads (as measured in field data) hit the "good" threshold. A page where the 75th percentile is at 250ms is failing, even if the median is well under 200ms.

## How to measure INP

Two distinct data sources matter.

**Field data** is what real users experienced on real devices, aggregated over the past 28 days. This is what Google uses for ranking. Sources:

- **Google Search Console.** The Core Web Vitals report shows INP performance broken down by URL group. The most authoritative source for what's failing.
- **CrUX (Chrome User Experience Report).** The underlying dataset Search Console pulls from. Available directly via the CrUX API for sites that want raw access.
- **PageSpeed Insights.** Shows the field data alongside the lab data on a per-URL basis.

**Lab data** is what a synthetic test produces in a controlled environment. Useful for debugging, not authoritative for ranking. Sources:

- **PageSpeed Insights** (lab section)
- **Lighthouse** in Chrome DevTools
- **WebPageTest** with throttled simulations

The trap: a page can pass lab tests while failing field data, or vice versa. Always trust field data over lab data when they disagree. The synthetic test isn't measuring what real users experience.

The other diagnostic tool worth using:

- **Total Blocking Time (TBT)** in lab data correlates strongly with INP for many pages. When field data is sparse (low-traffic pages), TBT is the best lab proxy for INP performance.

## Does INP affect rankings

Yes. INP is part of the Core Web Vitals, which are part of the page experience signal, which is one of Google's ranking factors. The weighting is real but modest. INP is unlikely to single-handedly move a page's ranking by many positions, but combined with other ranking signals it contributes meaningfully.

What's more important than the direct ranking effect: INP correlates strongly with bounce rate and conversion. A slow, unresponsive page loses users regardless of where it ranks. Fixing INP improves user behavior, which improves engagement signals, which feeds back into rankings.

## How to optimize INP

The optimizations that move INP from failing to passing.

### 1. Reduce JavaScript execution on the main thread

Most INP failures trace to JavaScript blocking the main thread. Practical interventions:

- **Defer non-critical JavaScript.** Move third-party scripts (analytics, chat widgets, A/B testing tools) below the priority work. Use `defer` or `async` attributes appropriately.
- **Code splitting.** Ship only the JavaScript needed for the current page rather than a single bundle.
- **Remove unused JavaScript.** Tools like Coverage in Chrome DevTools surface unused JS that can be removed.
- **Optimize JavaScript bundles.** Tree-shaking, modern targeting (drop ES5 polyfills if you don't need IE11), minification.

### 2. Break up long tasks

Long tasks (over 50ms of continuous main-thread work) block interaction handling. Strategies to break them up:

- **Yield to the main thread frequently.** Use `setTimeout`, `requestIdleCallback`, or the `scheduler.postTask` API to break work into chunks.
- **Move work off the main thread.** Web Workers handle CPU-intensive work without blocking interaction.
- **Reduce work in event handlers.** A click handler that does 200ms of work before updating the UI is a 200ms INP penalty. Defer the work or update the UI first and process the rest async.

### 3. Optimize event handler patterns

- **Avoid synchronous heavy work in handlers.** A click handler that calculates pricing across 500 line items synchronously will fail INP. Show a loading state immediately, do the work async.
- **Debounce rapid-fire events.** Input events on a search-as-you-type field, scroll handlers, resize handlers. Debounce to avoid running expensive work on every event.
- **Use passive event listeners** where possible for touch and scroll events.

### 4. Reduce DOM size and complexity

Large DOMs slow rendering, which contributes to the presentation delay component of INP.

- **Virtualize long lists.** Render only the visible portion of long lists instead of all items.
- **Avoid excessive nesting.** Flat DOM structures render faster than deeply nested ones.
- **Limit reflows and repaints.** Avoid layout-thrashing patterns where reads and writes interleave.

### 5. Optimize CSS performance

- **Reduce render-blocking CSS.** Critical CSS inline, non-critical deferred.
- **Avoid expensive selectors.** Highly specific or universal selectors in CSS can slow rendering.
- **Use `will-change` and `transform` for animations** to enable hardware acceleration.

### 6. Audit third-party scripts

Third-party scripts are a frequent culprit. Common offenders:

- Customer support chat widgets (Intercom, Drift, Zendesk)
- Marketing automation scripts (HubSpot, Marketo)
- A/B testing tools (Optimizely, VWO)
- Analytics (when not configured well)
- Social media share widgets
- Heavy advertising scripts

The fix is rarely to remove the script. The fix is to load it later (when the page is idle), or to evaluate whether the marginal value justifies the performance cost.

## Common INP failures we see

A few patterns that come up in client audits.

**Page builders shipping too much JavaScript.** Elementor, Divi, and similar WordPress page builders often ship enough JavaScript that even simple click interactions cross the INP threshold on lower-end mobile devices. Lighter alternatives (Gutenberg with native blocks, Bricks, Breakdance) score better.

**Unbatched state updates in React or Vue.** Multiple state updates triggering multiple re-renders within a single user interaction. Batching the updates or using transitions (React 18's `useTransition`) helps.

**Synchronous third-party scripts in the head.** A blocking third-party script in the document head blocks rendering and interaction. Move them later in the load order.

**Excessive event listeners.** A page with hundreds of event listeners (often from a heavy framework or page builder) takes longer to dispatch each event.

**CPU-intensive work on click.** Generating and inserting large amounts of HTML, expensive calculations, or running rich-text editor code synchronously in a click handler. Move to async or break into smaller chunks.

## How we approach INP audits at SEO Brothers

INP is part of every page-speed audit we run. The diagnostic flow:

1. Pull field data from Search Console for the URL group with the worst INP performance
2. Open the worst-performing pages in Chrome DevTools with the Performance panel
3. Record an interaction trace, identify the longest task in the interaction event
4. Determine whether the bottleneck is input delay, processing time, or presentation delay
5. Apply the relevant intervention from the list above

For partner agencies whose clients are failing Core Web Vitals due to INP, we run the audit, document the findings, and either implement directly or hand off prioritized recommendations to the client's development team.

If your Search Console is showing INP failures and you're not sure where to start, [get in touch](/tools/free-seo-audit/) and we'll walk through the diagnostics with you.
