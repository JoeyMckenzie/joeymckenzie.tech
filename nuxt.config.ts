import { fontFamily } from 'tailwindcss/defaultTheme';

export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    preset: 'netlify',
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
  runtimeConfig: {
    spotifyRefreshToken: '',
    spotifyClientId: '',
    spotifyClientSecret: '',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
    nowPlayingEndpoint:
          'https://api.spotify.com/v1/me/player?type=track,episode',
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
    icons: ['mdi', 'hugeicons'],
  },
});
