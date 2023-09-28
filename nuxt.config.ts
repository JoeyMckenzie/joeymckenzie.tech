// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  routeRules: {
    '/blog/**': { isr: true },
    '/api/**': { cors: true },
  },
  nitro: {
    preset: 'netlify',
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: [
    '@nuxt/image',
    '@nuxt/content',
    '@nuxtjs/robots',
    'nuxt-icon',
    'nuxt-feedme',
    '@pinia/nuxt',
  ],
  devtools: {
    enabled: true,
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    app: {
      spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
      spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      spotifyRefreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
      spotifyTokenEndpoint: 'https://accounts.spotify.com/api/token',
      spotifyNowPlayingEndpoint:
        'https://api.spotify.com/v1/me/player?type=track,episode',
      databaseUrl: process.env.DATABASE_URL,
    },
    public: {
      commitSha: process.env.COMMIT_REF,
    },
  },
  content: {
    highlight: {
      theme: 'vitesse-dark',
      preload: [
        'rust',
        'cs',
        'csharp',
        'sql',
        'makefile',
        'dockerfile',
        'java',
        'xml',
        'go',
      ],
    },
  },
});
