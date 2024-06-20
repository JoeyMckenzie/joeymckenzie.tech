import { fontFamily } from 'tailwindcss/defaultTheme';

export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    preset: 'vercel',
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    '@nuxt/ui',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
    ],
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', ...fontFamily.sans],
          },
        },
      },
    },
  },
  site: {
    url: 'https://joeymckenzie.tech',
    name: 'My personal blog and developer diary.',
    description: 'My personal blog and developer diary.',
    defaultLocale: 'en',
  },
  colorMode: {
    classSuffix: '',
  },
  ui: {
    icons: ['tabler'],
  },
});
