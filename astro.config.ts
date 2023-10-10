import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

export default defineConfig({
  site: 'https://joeymckenzie.tech',
  integrations: [
    sitemap(),
    vue(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
