// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

// Sitemap is hand-rolled at src/pages/sitemap.xml.ts (single /sitemap.xml,
// no multi-file index). See that file for how to add or exclude pages.

// https://astro.build/config
export default defineConfig({
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
