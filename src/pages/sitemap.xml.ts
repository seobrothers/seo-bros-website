// Hand-rolled sitemap served at /sitemap.xml.
//
// Why hand-rolled instead of @astrojs/sitemap?
// The integration always wraps output in a sitemap index (sitemap-index.xml
// + sitemap-0.xml), even when there's only one child sitemap. With well under
// 50,000 URLs that wrapper is useless overhead and produces three sitemap
// URLs where one is cleaner. This endpoint outputs a single sitemap.xml.
//
// How to update the sitemap:
//
//   Adding a guide: drop a .md file in src/content/guides/. It will be
//   auto-discovered here. Set draft: true to keep it out of the sitemap
//   (matches the dynamic route's behavior, which also skips drafts in prod).
//
//   Adding a case study: drop a .md file in src/content/case-studies/.
//   It will be auto-discovered. All case studies (campaign and partner)
//   are included.
//
//   Adding a new top-level page (e.g. /partners/): add the absolute path
//   to STATIC_PAGES below. Include trailing slash to match the site's
//   trailingSlash: 'always' config.
//
//   Hiding a page from the sitemap (e.g. a paid lander): add its absolute
//   path to EXCLUDED_PATHS, and set noindex={true} on the page's <Layout>
//   so robots see it consistently.
//
//   The robots.txt points at /sitemap.xml, and public/_redirects has 301s
//   from /sitemap-index.xml, /sitemap-0.xml, and /sitemap_index.xml so any
//   legacy or Yoast-style references resolve here.

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { publishedAuthors } from "../data/authors";
import { INDUSTRIES } from "../data/industries";

export const prerender = true;

const SITE = "https://seobrothers.com";

const STATIC_PAGES = [
  "/",
  "/about/",
  "/acquires-smart-web-solutions/",
  "/ai-seo/",
  "/ai-seo/local/",
  "/careers/",
  "/case-studies/",
  "/guides/",
  "/guides/agency/",
  "/guides/cities/",
  "/guides/seo/",
  "/industries/",
  "/partner-package/",
  "/pricing/",
  "/privacy/",
  "/sign-up/",
  "/terms/",
  "/white-label-seo/",
];

const EXCLUDED_PATHS = new Set<string>([]);

const RESERVED_GUIDE_SLUGS = new Set(["seo", "industry", "agency", "cities"]);

export const GET: APIRoute = async () => {
  const allGuides = await getCollection("guides");

  // Industry-category guides are served at /industries/{slug}/ (see
  // src/data/industries.ts); they're emitted from INDUSTRIES below, not here.
  const guides = allGuides
    .filter((g) => !RESERVED_GUIDE_SLUGS.has(g.id))
    .filter((g) => g.data.category !== "industry")
    .filter((g) => !import.meta.env.PROD || !g.data.draft)
    .map((g) => `/guides/${g.id}/`);

  const liveGuideIds = new Set(
    allGuides
      .filter((g) => !import.meta.env.PROD || !g.data.draft)
      .map((g) => g.id)
  );
  const industries = INDUSTRIES
    .filter((i) => liveGuideIds.has(i.guideId))
    .map((i) => `/industries/${i.slug}/`);

  const caseStudies = (await getCollection("caseStudies"))
    .filter((c) => !import.meta.env.PROD || !c.data.draft)
    .map((c) => `/case-studies/${c.id}/`);

  // Author pages are gated by `published` in src/data/authors.ts.
  const authorPages = publishedAuthors().map((a) => `/authors/${a.slug}/`);

  const paths = [...STATIC_PAGES, ...guides, ...industries, ...caseStudies, ...authorPages]
    .filter((p) => !EXCLUDED_PATHS.has(p))
    .sort();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
};
