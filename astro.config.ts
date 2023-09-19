import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: 'https://joeymckenzie.tech',
  integrations: [
    mdx(),
    sitemap(),
    vue(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
