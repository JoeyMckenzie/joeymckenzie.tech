// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-pages',
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: [
    '@nuxt/content',
    '@nuxtjs/robots',
    'nuxt-icon',
    'nuxt-feedme',
    '@pinia/nuxt',
    '@nuxt/image',
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
      spotifyClientId: import.meta.env.SPOTIFY_CLIENT_ID,
      spotifyClientSecret: import.meta.env.SPOTIFY_CLIENT_SECRET,
      spotifyRefreshToken: import.meta.env.SPOTIFY_REFRESH_TOKEN,
      spotifyTokenEndpoint: 'https://accounts.spotify.com/api/token',
      spotifyNowPlayingEndpoint:
        'https://api.spotify.com/v1/me/player?type=track,episode',
      databaseUrl: import.meta.env.DATABASE_URL,
    },
    public: {
      commitSha: import.meta.env.VERCEL_GIT_COMMIT_SHA,
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
