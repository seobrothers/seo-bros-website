import type { APIRoute } from "astro";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

// RSS for the product updates, hand-rolled like the sitemap. Full post
// bodies go in so a reader (or the newsletter tool) gets the whole update
// without a click. Drafts stay out in prod. Built at deploy time, never in
// the Worker (the container renderer needs node built-ins).
export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://seobrothers.com");
  const posts = (await getCollection("updates"))
    .filter((p) => !import.meta.env.PROD || !p.data.draft)
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
    .slice(0, 50);

  const container = await AstroContainer.create();
  const items: string[] = [];
  for (const post of posts) {
    const { Content } = await render(post);
    const html = await container.renderToString(Content);
    const url = new URL(`/updates/${post.id}/`, base).href;
    items.push(
      `<item>` +
        `<title>${esc(post.data.title)}</title>` +
        `<link>${url}</link>` +
        `<guid isPermaLink="true">${url}</guid>` +
        `<pubDate>${post.data.publishDate.toUTCString()}</pubDate>` +
        `<description>${esc(post.data.summary)}</description>` +
        `<content:encoded><![CDATA[${html}]]></content:encoded>` +
        `</item>`,
    );
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">` +
    `<channel>` +
    `<title>SEO Brothers product updates</title>` +
    `<link>${new URL("/updates/", base).href}</link>` +
    `<atom:link href="${new URL("/updates/rss.xml", base).href}" rel="self" type="application/rss+xml"/>` +
    `<description>What changed on the Tideworthy platform, and what we learned building it.</description>` +
    `<language>en-us</language>` +
    items.join("") +
    `</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
