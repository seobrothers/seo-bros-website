// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://seobrothers.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      // Keep noindexed paid-only landers out of the sitemap. Add new lander
      // URLs here whenever a page passes noindex={true} to its Layout.
      filter: (page) => page !== 'https://seobrothers.com/seo-for-plumbers/',
    }),
  ],
  adapter: cloudflare(),
});