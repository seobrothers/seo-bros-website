// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// Sitemap is hand-rolled at src/pages/sitemap.xml.ts (single /sitemap.xml,
// no multi-file index). See that file for how to add or exclude pages.

// https://astro.build/config
export default defineConfig({
  site: 'https://seobrothers.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  adapter: cloudflare(),
});
