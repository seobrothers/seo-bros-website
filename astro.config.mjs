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
  // Astro 7 changed the default from true to 'jsx', which strips whitespace
  // between adjacent inline elements (e.g. guide bylines rendered
  // "Bate·July" instead of "Bate · July"). Keep the pre-7 behavior; only
  // revisit alongside a visual QA pass.
  compressHTML: true,
  build: {
    format: 'directory',
  },
  // "compile" optimizes images at build time (Cloudflare can't run sharp at
  // runtime). Only applies to images rendered via astro:assets / <Image>;
  // raw <img> tags pointing at public/ are served as-is.
  adapter: cloudflare({ imageService: 'compile' }),
  // MDX lets guides embed components (e.g. <VolumeChart> on city guides).
  // astro / @astrojs/cloudflare / @astrojs/mdx majors move together.
  integrations: [mdx()],
});
