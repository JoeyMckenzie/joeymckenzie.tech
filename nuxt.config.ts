import { fontFamily } from 'tailwindcss/defaultTheme';

export default defineNuxtConfig({
  compatibilityDate: '2024-08-21',
  future: {
    compatibilityVersion: 4,
  },
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
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  fonts: {
    families: [
      { name: 'Figtree', provider: 'google' },
    ],
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Figtree', ...fontFamily.sans],
          },
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      commitSha: import.meta.env.COMMIT_SHA,
    },
    spotifyRefreshToken: '',
    spotifyClientId: '',
    spotifyClientSecret: '',
    tursoDatabaseUrl: '',
    tursoAuthToken: '',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
    nowPlayingEndpoint:
          'https://api.spotify.com/v1/me/player?type=track,episode',
  },
  colorMode: {
    classSuffix: '',
  },
  image: {
    provider: 'netlify',
  },
  site: {
    url: 'https://joeymckenzie.tech',
    name: 'joeymckenzie.tech',
    description: 'A blog about tech, languages, frameworks, and sometimes beer.',
    defaultLocale: 'en',
  },
  ui: {
    icons: ['mdi', 'hugeicons', 'simple-icons', 'logos', 'ion', 'pixelarticons'],
  },
});
