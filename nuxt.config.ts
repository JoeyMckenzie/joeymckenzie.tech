// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: ['@nuxt/content', '@nuxtjs/robots', 'nuxt-icon', 'nuxt-feedme'],
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
    },
    public: {
      commitSha: process.env.NUXT_PUBLIC_CF_PAGES_COMMIT_SHA,
    },
  },
});
