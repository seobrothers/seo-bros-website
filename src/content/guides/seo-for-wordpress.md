---
title: "SEO for WordPress Sites: Plugins, Architecture, and the Pieces That Still Matter"
category: seo
publishDate: 2026-04-30
updatedDate: 2026-05-06
author: "Adam Bate"
summary: WordPress SEO advice that's still relevant in 2026, plus the pieces from the older playbook that have gone stale. Plugin recommendations, content siloing, child theming for safe customization, and the page-speed reality post Core Web Vitals.
featured: false
---

WordPress still powers more of the web than any other CMS, somewhere north of 40% of all sites at last count. Most of the WordPress SEO advice on the internet was written between 2014 and 2018 and hasn't aged well. Plugin recommendations from that era reference tools that no longer exist or have been superseded. Page-speed advice from that era predates Core Web Vitals entirely.

This guide is the version of WordPress SEO advice that holds up in 2026. It covers what actually still matters, what's been replaced, and where the modern WordPress stack diverges from the 2016-era playbook.

## What's still true

A few foundational pieces that have not changed since WordPress's earliest SEO-friendly days.

**WordPress is genuinely SEO-friendly out of the box.** Clean URLs, proper heading structure, sensible markup, easy metadata management. Compared to building from scratch or using less mature CMSs, WordPress gives you most of what you need without configuration.

**The plugin layer matters more than the theme layer for SEO.** A great theme on top of poorly configured plugins will underperform a basic theme with the right plugins doing the right work.

**Content siloing through parent and child pages, or through categories and tags, remains the best practice for site architecture.** WordPress makes this easier than most CMSs because the relationship structures are first-class concepts.

**Child themes remain the right way to customize an existing theme without losing the ability to update the parent theme.** Direct edits to a theme's files survive exactly until the next theme update.

## Plugin recommendations for 2026

The 2016 plugin landscape recommended Yoast SEO, WP Super Cache, WP Smush, WP Minify, and Redirection. Most of those references are now stale or have been superseded.

**Current recommendations:**

**SEO plugin:**
- **Yoast SEO** is still good, still actively maintained, still our default for most sites. The free tier covers what most sites need.
- **Rank Math** is the strongest competitor that's emerged in the last several years. Lighter, faster in some configurations, with a better UI for many people. Either is fine. We default to Yoast out of habit, not because Rank Math is worse.
- **All In One SEO** has improved considerably. Worth considering if you're already on it.

**Caching:**
- **WP Rocket** (paid) is what we recommend for most production WordPress sites. Replaces what WP Super Cache used to do, and does it better.
- **Free alternatives:** LiteSpeed Cache if you're on a LiteSpeed-compatible host, or W3 Total Cache for general use. WP Super Cache still works but the development pace has slowed.

**Image optimization:**
- **ShortPixel** or **Imagify** for automatic compression and WebP conversion. WP Smush is still around but the alternatives have caught up and surpassed it for most use cases.

**Minification and performance:**
- **WP Rocket** handles minification, deferring, and lazy loading in addition to caching, which makes WP Minify-style standalone plugins largely unnecessary.
- For sites not on Rocket, **Autoptimize** does most of what WP Minify did, with active development.

**Redirects:**
- **Redirection** plugin is still excellent and still the default. One of the rare 2016-era recommendations that genuinely held up.

**Schema markup:**
- Yoast and Rank Math both handle most schema needs internally now. For specific advanced schema, **Schema Pro** or **WP SEO Structured Data Schema** add depth.

**Analytics integration:**
- **Site Kit by Google** for unified Search Console, Analytics, and PageSpeed Insights inside WordPress. The most important addition to the modern WordPress SEO stack.

## Page speed: the major shift since 2016

The 2016 version of this guide claimed page speed wasn't a major ranking factor. That's not true anymore. It hasn't been true since 2018 when speed signals were rolled into the algorithm explicitly, and it became dramatically less true in 2021 when Core Web Vitals became part of the page experience signal.

What matters now:

- **Largest Contentful Paint (LCP).** Time to render the largest visible element. Target under 2.5 seconds.
- **Interaction to Next Paint (INP).** Replaced FID in 2024. Measures responsiveness to user input. Target under 200ms.
- **Cumulative Layout Shift (CLS).** Visual stability. Target under 0.1.

For deeper coverage of INP specifically, see [our guide on interaction to next paint](/guides/interaction-to-next-paint/).

The WordPress-specific implications:

- **Hosting matters more than caching plugins.** A managed WordPress host (Kinsta, WP Engine, Pressable, Cloudways with the right stack) outperforms cheap shared hosting plus aggressive caching plugins.
- **Page builders are a common speed killer.** Heavy page builders (Elementor, Divi, WPBakery) ship substantial CSS and JavaScript that hurt Core Web Vitals on the front-end. Lighter alternatives (Gutenberg with theme support, Bricks, Breakdance) typically score better.
- **Image optimization is non-negotiable.** WebP conversion, responsive images, and lazy loading should be on every site by default. Most modern image plugins handle all three.
- **Disable what you don't use.** WordPress emoji scripts, embed scripts, third-party plugin scripts that load globally when only one page needs them. Audit and disable.

## Content siloing in WordPress

The siloing approach hasn't changed. Group thematically related content using parent/child page hierarchies for static content, and categories for blog content. Internal linking stays largely within silos.

Two WordPress-specific notes:

**Categories versus tags.** Categories are hierarchical (parent-child relationships), tags are flat. For siloing, use categories. Tags are auxiliary metadata for cross-cutting themes, not structural.

**Permalink structure.** Use `/%category%/%postname%/` for blog content if your category structure represents real silos, or `/%postname%/` if your blog is flatter. Parent/child page hierarchy preserves automatically in URLs.

For broader on-page architecture, see [our on-page SEO guide](/guides/on-page-seo/).

## Child theming for safe customization

Still the right approach. Create a child theme, customize CSS and templates there, and the parent theme can still receive updates without overwriting your changes.

The modern alternative for many sites is using a theme with built-in customization options (most modern themes), so child themes are less universal than they used to be. But for any custom code work, the child-theme pattern remains the safest approach.

## 301 redirects and migrations

The Redirection plugin is still our default for managing redirects within WordPress. It handles individual URL redirects, regex patterns for bulk redirects, and tracks 404 errors so you can identify URLs to redirect.

Major site migrations should still use server-level redirects (in `.htaccess` for Apache, in `nginx.conf` for nginx) rather than plugin-level redirects, because they're faster and survive plugin issues. Use the plugin for ongoing day-to-day redirects after the migration.

For the broader migration framework, see [our website redesign SEO guide](/guides/website-redesign-seo/).

## Common WordPress SEO mistakes

A few patterns we see repeatedly.

- **Default permalinks.** `/?p=237` URLs that signal nothing about content topic. Switch to a slug-based permalink structure on day one.
- **Plugin overload.** 40+ active plugins, many doing redundant work or fighting each other. Each adds load time and attack surface. Audit and prune.
- **Theme mismatch with content goals.** A heavy magazine theme on a brochure site, or a portfolio theme being forced into ecommerce. Pick a theme that matches the actual use case.
- **No SSL.** Still occasionally seen on older sites. Non-negotiable in 2026. HTTPS is required, full stop.
- **Default robots.txt blocking the wrong things.** WordPress sometimes ships with `/wp-admin/` blocked broadly enough to break crawls. Verify the robots.txt is sensible.
- **Caching plugins that interfere with logged-in views.** Make sure caching is bypassed for logged-in users so the site you're editing isn't a cached version.

## How we approach WordPress SEO at SEO Brothers

WordPress is the platform we work with most often, both for our own sites and for partner agency clients. The plugin and architecture decisions above are our default stack. Specific configurations vary by client, but the foundation is consistent.

For partner agencies whose clients run on WordPress, we operate the SEO layer end-to-end while the agency handles the broader website relationship. WordPress-specific work (plugin selection, theme customization, hosting recommendations) is part of the engagement where it makes sense.

If you're running a WordPress site and not sure whether the plugin stack or hosting setup is helping or hurting, [get in touch](/sign-up/) and we'll walk through the configuration with you.
