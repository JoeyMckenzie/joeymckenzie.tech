// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  site: {
    url: 'https://joeymckenzie.tech',
  },
  nitro: {
    preset: 'vercel',
  },
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-icon',
    '@nuxtjs/web-vitals',
    'nuxt-simple-robots',
    'nuxt-simple-sitemap',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    'shadcn-nuxt',
  ],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    viewer: true,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  webVitals: {
    provider: 'vercel',
  },
  content: {
    highlight: {
      theme: 'one-dark-pro',
      preload: ['rust', 'go', 'php'],
    },
  },
});
