import { fontFamily } from 'tailwindcss/defaultTheme';

// https://nuxt.com/docs/api/configuration/nuxt-config
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
    '@nuxtjs/tailwindcss',
    '@nuxtjs/seo',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    'nuxt-particles',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  particles: {
    mode: 'full', // 'full' | 'slim' | 'basic' | 'custom'
    lazy: true,
  },
  fonts: {
    families: [
      { name: 'Inter', provider: 'bunny' },
      { name: 'Ubuntu', provider: 'bunny' },
      { name: 'Figtree', provider: 'bunny' },
      { name: 'JetBrains Mono', provider: 'bunny' },
    ],
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
  tailwindcss: {
    config: {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['JetBrains Mono', ...fontFamily.sans],
          },
        },
      },
    },
  },
});
