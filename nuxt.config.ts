// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
      commitSha: import.meta.env.COMMIT_REF,
    },
  },
  content: {
    highlight: {
      theme: 'vitesse-dark',
    },
  },
});
