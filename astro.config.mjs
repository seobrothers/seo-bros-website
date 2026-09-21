// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

// Sitemap is hand-rolled at src/pages/sitemap.xml.ts (single /sitemap.xml,
// no multi-file index). See that file for how to add or exclude pages.

// Strips HTML comments out of Markdown before it renders. Product update
// posts carry a `<!-- review ... -->` block for the person approving the
// pull request (sources, what was left out); it must never reach the page
// source or the RSS feed, since it names internal things the post itself
// does not.
function stripHtmlComments() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.filter(
      (c) => !(c.type === 'html' && /^\s*<!--[\s\S]*?-->\s*$/.test(c.value)),
    );
    node.children.forEach(walk);
  };
  return (tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [stripHtmlComments],
  },
  site: 'https://seobrothers.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  // "compile" optimizes images at build time (Cloudflare can't run sharp at
  // runtime). Only applies to images rendered via astro:assets / <Image>;
  // raw <img> tags pointing at public/ are served as-is.
  adapter: cloudflare({ imageService: 'compile' }),
  // MDX lets guides embed components (e.g. <VolumeChart> on city guides).
  // Pinned to @astrojs/mdx@^4 while on Astro 5; bump together on major upgrades.
  integrations: [mdx()],
});
