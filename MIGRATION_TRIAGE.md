# Content Migration Triage — seobrothers.com → seobrothers.co

Working sheet for migrating guides from the legacy WordPress site. Edit recommendations / consolidate-into / redirect targets in place; the migration scripts will read from this file.

**Total old guides:** 69
**Already migrated:** 7
**To process:** 62

## Slug & content conventions

- **No dates, years, or "updated"/"new"/"improved" markers in slugs.** Slugs read evergreen so URLs don't visually age.
- **No em dashes (—) in any prose written for the site.** Use commas, parens, colons, or sentence breaks.
- **Filename = slug.** The content collection uses filename-based slugs, so `src/content/guides/foo-bar.md` → `/guides/foo-bar/`. Same goes for `src/content/cities/`.
- **Slugs use kebab-case, lowercase, no trailing words like `-companies` or `-guide`.** Example: legacy `halifax-seo-companies` becomes `halifax-seo`.

---

## Pillar / Consolidation Map

This is the strategic shape. Each pillar is one new guide on the new site; old URLs in the cluster 301 to it.

| Pillar (new slug) | Old URLs folding in | Anchor/source guide |
|---|---|---|
| `private-blog-networks` | pbns + pbn-hosting + domain-registration + 5-pbn-mistakes | pbns (3.5k words, longest) |
| `link-building` | link-building + low-hanging-fruit-backlinks + reclaiming-broken-backlinks + understanding-your-link-profile | link-building (2.5k) |
| `keyword-mapping` | keyword-mapping + competitive-keyword-insights + understanding-keyword-groups | keyword-mapping |
| `on-page-seo` | on-page-seo + 4-most-important-on-page-elements + our-on-page-optimization-documents + featured-answer-box + website-structure-content-silos | on-page-seo |
| `local-seo` | 10-steps-to-dominating-local-seo + seo-vs-local-seo + how-to-structure-website-local-business + google-my-business | 10-steps |
| `legal-services-seo` | seo-for-lawyers + family-lawyers + immigration-lawyers + personal-injury-law | seo-for-lawyers (3.8k) |
| `financial-services-seo` | seo-for-accountants + insurance-seo + mortgage-seo | seo-for-accountants (3.5k) |
| `property-management-seo` | seo-for-property-management + seo-for-apartments | property-management |
| `plastic-surgery-seo` | plastic-surgery-seo + plastic-surgery-leads | plastic-surgery-seo (2025) |
| `seo-audit` | seo-audit + seo-audit-deliverables | seo-audit |
| `what-to-blog-about` | what-to-blog-about + blogging-for-seo-improving-content | what-to-blog-about |
| `home-services-seo` (NEW hub) | (no ports — new content) | hub-and-spoke for plumbers, HVAC, carpet-cleaning, tree-service |
| `serp-features-evolution` (NEW) | featured-answer-box reframed | new strategic angle, see Decision 6 |

**White-label cluster — kept separate, not consolidated:**
- `white-label-seo-reporting` (already migrated, agency-ops/reseller angle)
- `white-label-seo-audits` (B2B reseller angle)
- `free-website-seo-audit` (lead-magnet angle for end customers)

---

## Decisions (resolved)

1. ~~Lawyer pillar shape~~ → **Pillar** (`/guides/legal-services-seo/` with subsections).
2. ~~Finance pillar shape~~ → **Pillar** (`/guides/financial-services-seo/` with subsections).
3. ~~Searcher intent placement~~ → **Standalone guide** at `/guides/searcher-intent/`.
4. ~~Trades pillar~~ → **Home Services hub** at `/guides/home-services-seo/`. Hub-and-spoke pattern: hub explains what makes home services SEO different (local intent, GMB, service-area, seasonal, review-driven), then internal links down to each vertical guide. Spokes: plumbers, HVAC, carpet-cleaning, tree-service. Not in hub: home-builder, auto-repair, funeral-home, property-management. HVAC stays an update-and-migrate; the hub itself is new content (no old URL ports into it).
5. ~~Disavow tool guide~~ → **Keep, reframe as an anti-guide.** Real demand exists, and we want to be the page that says "you almost certainly should not use this." Slug: `/guides/google-disavow-tool/`. Action changed from drop → update-and-migrate (with a heavy reframe).
6. ~~Featured answer box guide~~ → **Reframe as SERP overview / evolution guide.** Working title: "How Google SERPs Have Evolved (and Where They're Going)" or "Beyond the 10 Blue Links." Slug: `/guides/serp-features-evolution/` (final wording TBD at draft time). Old featured-snippet tactical content folds in as a section. SGE guide stays standalone, cross-linked.
7. ~~City pages location~~ → **Stay under `/guides/<city>-seo/`**, content reframed as guide-style rather than location landing pages. Linked only from the footer for now (not surfaced in primary nav). Slug convention: `<city>-seo` (drop the `-companies` suffix).

### Structural follow-ups from these decisions

- **Two new hub pages to author** (no old URL → new URL port): `home-services-seo` and `serp-features-evolution`.
- **Disavow guide reframe**: the old article's content gets mostly cut. New angle is "here's why you shouldn't use this, here's the few cases where you might, here's what to do instead."

---

## Full Triage Table

### Already migrated (skip)
| Slug | Status |
|---|---|
| halifax-seo-companies | ✓ migrated |
| how-to-sell-seo-services-to-clients | ✓ migrated |
| interaction-to-next-paint | ✓ migrated |
| keyword-research | ✓ migrated |
| seo-for-plumbers | ✓ migrated |
| our-new-and-improved-tree-service-seo-guide-seo-for-arborists | ✓ migrated as `tree-service-seo` |
| white-label-seo-reporting | ✓ migrated |

### Industry / vertical guides
| Slug | Year | Length | Quality | Action | Consolidate Into | Redirect Target | Notes |
|---|---|---|---|---|---|---|---|
| cannabis-seo | 2023 | M | evergreen | migrate | — | `/guides/cannabis-seo/` | Solid; no stale elements |
| seo-for-family-lawyers | 2023 | M | partial | consolidate | legal-services-seo | `/guides/legal-services-seo/` | Minor tool name updates |
| plastic-surgery-seo | 2025 | M | evergreen | migrate | — | `/guides/plastic-surgery-seo/` | Most recent, strong base |
| carpet-cleaning-seo | 2023 | M-L | partial | update | — | `/guides/carpet-cleaning-seo/` | GMB terminology updates |
| audiology-seo | 2023 | M | partial | update | — | `/guides/audiology-seo/` | Add CWV references |
| acupuncture-seo | 2023 | M | partial | update | — | `/guides/acupuncture-seo/` | Add AI/voice search, schema |
| seo-for-property-management | 2023 | M | partial | consolidate | property-management-seo | `/guides/property-management-seo/` | 2+ year old stats |
| seo-for-personal-injury-law | 2023 | M | partial | consolidate | legal-services-seo | `/guides/legal-services-seo/` | High-value vertical |
| home-builder-seo | 2023 | M | evergreen | migrate | — | `/guides/home-builder-seo/` | Quality-first content |
| insurance-seo | 2023 | S | thin | consolidate | financial-services-seo | `/guides/financial-services-seo/` | ~1.2k, merge |
| hvac-seo | 2023 | S | thin | update | — | `/guides/hvac-seo/` | Or pillar with trades (see Decision 4) |
| funeral-home-seo | 2023 | S | evergreen | migrate | — | `/guides/funeral-home-seo/` | Niche, addresses dup-content challenge |
| seo-for-lawyers | 2023 | L | partial | consolidate | legal-services-seo | `/guides/legal-services-seo/` | 3.8k words, anchor of pillar |
| seo-for-immigration-lawyers | 2023 | M | partial | consolidate | legal-services-seo | `/guides/legal-services-seo/` | Generic content |
| seo-for-accountants | 2023 | L | partial | consolidate | financial-services-seo | `/guides/financial-services-seo/` | 3.5k words, anchor of pillar |
| orthodontist-seo | 2023 | M | evergreen | migrate | — | `/guides/orthodontist-seo/` | Distinct from dental-seo |
| seo-for-apartments | 2023 | M | partial | consolidate | property-management-seo | `/guides/property-management-seo/` | Same vertical |
| plastic-surgery-leads | 2023 | M | partial | consolidate | plastic-surgery-seo | `/guides/plastic-surgery-seo/` | Broader lead-gen overlaps |
| mortgage-seo | 2023 | M | partial | consolidate | financial-services-seo | `/guides/financial-services-seo/` | Missing AI/zero-click refs |
| dental-seo-for-dentists | 2023 | M | partial | update | — | `/guides/dental-seo/` | Slug change suggested |
| seo-for-auto-repair-shops | 2023 | M | evergreen | migrate | — | `/guides/auto-repair-seo/` | Slug shortened |
| maximizing-seo-for-your-medspa | 2023 | M | evergreen | migrate | — | `/guides/medspa-seo/` | Slug shortened |
| seo-hair-transplant-clinics | 2023 | M | evergreen | migrate | — | `/guides/hair-transplant-seo/` | Slug normalized |
| franchise-seo | 2022 | M | partial | update | — | `/guides/franchise-seo/` | Oldest, multi-location angle |

### General SEO concepts
| Slug | Year | Length | Quality | Action | Consolidate Into | Redirect Target | Notes |
|---|---|---|---|---|---|---|---|
| on-page-seo | 2016 | M | partial | update + absorb | — | `/guides/on-page-seo/` | Pillar; absorbs 4 old on-page guides |
| seo-software-tools | 2016 | M | stale | drop | — | `/guides/` | Pricing/features changed dramatically |
| google-my-business | 2016 | S | partial | consolidate | local-seo | `/guides/local-seo/` | Rebrand to GBP, modernize |
| seo-audit | 2016 | L | partial | update + absorb | — | `/guides/seo-audit/` | Add CWV, E-E-A-T, voice |
| redesign-seo | 2018 | L | partial | update | — | `/guides/website-redesign-seo/` | 9-step process valid, supplement w/ CWV |
| googles-search-generative-experience | 2023 | L | partial | update | — | `/guides/google-search-generative-experience/` | Update SGE rollout status |
| seo-for-wordpress-websites | 2016 | M | mixed | update | — | `/guides/seo-for-wordpress/` | Salvageable, see WordPress checklist below |
| white-hat-seo | 2016 | M | partial | update | — | `/guides/white-hat-seo/` | Trim historical, keep principles |
| seo-audit-deliverables | 2016 | M | partial | consolidate | seo-audit | `/guides/seo-audit/` | Merge as "Audit Delivery" section |
| mobile-first-index-seo | 2017 | S | stale | drop | — | `/guides/` | Predictive framing obsolete |

### Local SEO cluster
| Slug | Year | Length | Quality | Action | Consolidate Into | Redirect Target | Notes |
|---|---|---|---|---|---|---|---|
| 10-steps-to-dominating-local-seo | 2020 | M | evergreen | update + absorb | — | `/guides/local-seo/` | Anchor of pillar, target 4.5-5.5k |
| seo-vs-local-seo | 2020 | XS | thin | consolidate | local-seo | `/guides/local-seo/` | 320 words, intro framing |
| how-to-structure-a-website-structure-local-business | 2020 | M | evergreen | consolidate | local-seo | `/guides/local-seo/` | Heavy overlap with 10-steps |

### City pages (stay under `/guides/`, reframed as guide content, footer-only links)
| Slug | Year | Length | Quality | Action | Redirect Target | Notes |
|---|---|---|---|---|---|---|
| kitchener-waterloo-seo-companies | 2025 | S | evergreen | migrate | `/guides/kitchener-waterloo-seo/` | Slug shortened, lives in guides collection |
| hamilton-on-seo-companies | 2025 | M | evergreen | migrate | `/guides/hamilton-seo/` | Slug shortened, lives in guides collection |
| vancouver-bc-seo-companies | 2025 | S | evergreen | migrate | `/guides/vancouver-seo/` | Slug shortened, lives in guides collection |
| halifax-seo-companies (already in repo) | 2025 | — | — | migrated | `/guides/halifax-seo/` | Slug shortened |

### PBN cluster
| Slug | Year | Length | Quality | Action | Consolidate Into | Redirect Target | Notes |
|---|---|---|---|---|---|---|---|
| private-blog-networks-pbns | 2016 | L | partial | consolidate | private-blog-networks | `/guides/private-blog-networks/` | 3.5k words, foundation |
| private-blog-networks-pbn-hosting | 2016 | M | partial | consolidate | private-blog-networks | `/guides/private-blog-networks/` | Hosting/footprint subsection |
| private-blog-networks-domain-registration | 2016 | S | partial | consolidate | private-blog-networks | `/guides/private-blog-networks/` | Registrar subsection |
| 5-pbn-mistakes | 2016 | S | partial | consolidate | private-blog-networks | `/guides/private-blog-networks/` | Pitfalls subsection |

### Link building cluster
| Slug | Year | Length | Quality | Action | Consolidate Into | Redirect Target | Notes |
|---|---|---|---|---|---|---|---|
| link-building | 2016 | M | dated | update + absorb | — | `/guides/link-building/` | Anchor; refresh for post-2024 algos |
| low-hanging-fruit-backlink-sources | 2019 | XS | dated | consolidate | link-building | `/guides/link-building/` | "Quick Wins" subsection |
| reclaiming-broken-backlinks | 2019 | XS | dated | consolidate | link-building | `/guides/link-building/` | "Broken Link Recovery" subsection |
| understanding-your-link-profile-4-link-profile-elements-to-monitor | 2019 | S | dated | consolidate | link-building | `/guides/link-building/` | "Link Profile Audit" subsection |
| when-to-use-google-disavow-links-tool | 2019 | XS | stale | **update (anti-guide)** | — | `/guides/google-disavow-tool/` | Reframe: "you almost certainly should NOT use this." See Decision 5 |

### Keyword cluster
| Slug | Year | Length | Quality | Action | Consolidate Into | Redirect Target | Notes |
|---|---|---|---|---|---|---|---|
| keyword-mapping | 2019 | M | partial | update + absorb | — | `/guides/keyword-mapping/` | Anchor; sister to keyword-research |
| competitive-keyword-insights | 2019 | M | partial | consolidate | keyword-mapping | `/guides/keyword-mapping/` | Competitor analysis subsection |
| understanding-keyword-groups | 2019 | S | partial | consolidate | keyword-mapping | `/guides/keyword-mapping/` | Intent taxonomy subsection |

### On-page details (folding into on-page pillar)
| Slug | Year | Length | Quality | Action | Consolidate Into | Redirect Target | Notes |
|---|---|---|---|---|---|---|---|
| our-on-page-optimization-documents | 2019 | M | evergreen | consolidate | on-page-seo | `/guides/on-page-seo/` | Template/workflow subsection |
| website-structure-content-silos | 2019 | M | evergreen | consolidate | on-page-seo | `/guides/on-page-seo/` | Site architecture subsection |
| the-four-most-important-on-page-elements-to-optimize | 2019 | M | partial | consolidate | on-page-seo | `/guides/on-page-seo/` | Foundational, now redundant |
| optimizing-your-content-for-the-featured-answer-box | 2019 | M-L | partial | **reframe** | serp-features-evolution | `/guides/serp-features-evolution/` | Becomes seed for new SERP-evolution guide. See Decision 6 |

### Content strategy
| Slug | Year | Length | Quality | Action | Consolidate Into | Redirect Target | Notes |
|---|---|---|---|---|---|---|---|
| what-to-blog-about | 2020 | L | evergreen | update + absorb | — | `/guides/what-to-blog-about/` | Anchor; update Ahrefs screenshots |
| blogging-for-seo-improving-content | 2019 | XS | evergreen | consolidate | what-to-blog-about | `/guides/what-to-blog-about/` | Heavy overlap |
| searcher-intent-hierarchy | 2019 | M | evergreen | update | — | `/guides/searcher-intent/` | Slug shortened, see Decision 3 |

### Agency-ops / tools
| Slug | Year | Length | Quality | Action | Redirect Target | Notes |
|---|---|---|---|---|---|---|
| sitebulb-best-seo-crawler-auditor-never-knew | 2018 | M | needs update | **keep & update** | `/guides/sitebulb-review/` | Slug shortened, update checklist below |
| free-website-seo-audit | 2020 | L | evergreen | update | `/guides/free-website-seo-audit/` | Lead magnet, B2C angle |
| white-label-seo-audits | 2020 | L | evergreen | update | `/guides/white-label-seo-audits/` | Reseller, B2B angle |

---

## Update Checklists

### Sitebulb review (decided KEEP)
- [ ] Confirm current pricing tier structure (was $35/mo)
- [ ] New UI screenshots — redesigned multiple times since 2018
- [ ] Refresh competitive comparison vs Screaming Frog, ContentKing, DeepCrawl, Botify
- [ ] Verify feature names haven't been rebranded (Crawl Data Visualization, Cross-metric Analysis)
- [ ] Confirm "no-limit usage via desktop resources" claim still holds
- [ ] Update publish date to current

### WordPress SEO (decided KEEP, ~30-40% rewrite)
**Keep:**
- Yoast SEO plugin guidance
- Content siloing approach
- Child theming for safe edits
- 301 redirect handling

**Replace:**
- WP Super Cache, WP Minify recommendations → modern caching/optimization plugins
- Pre-Core-Web-Vitals page speed framing → CWV-first section
- Remove the "page speed isn't a huge ranking factor" claim

---

## Drop list (with redirect targets)
| Slug | Redirect To | Reason |
|---|---|---|
| seo-software-tools | `/guides/` | Pricing/features changed dramatically since 2016 |
| mobile-first-index-seo | `/guides/` | Predictive framing, Google completed transition by 2021 |

---

## Redirect map (consolidated view)

For the `_redirects` file (Cloudflare Pages) once content is finalized. This is auto-derivable from the table above; placeholder for now:

```
/guides/private-blog-networks-pbns/                     /guides/private-blog-networks/             301
/guides/private-blog-networks-pbn-hosting/              /guides/private-blog-networks/             301
/guides/private-blog-networks-domain-registration/      /guides/private-blog-networks/             301
/guides/5-pbn-mistakes/                                  /guides/private-blog-networks/             301
# ... (full map generated after table is finalized)
```
