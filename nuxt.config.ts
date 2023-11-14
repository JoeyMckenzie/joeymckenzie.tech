// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  srcDir: 'src',
  nitro: {
    preset: 'vercel',
  },
  css: ['~/assets/css/tailwind.css'],
  hooks: {
    'components:dirs': (dirs) => {
      dirs.unshift({
        path: '~/components/ui',

        // this is required else Nuxt will autoImport `.ts` file
        extensions: ['.vue'],
        // prefix for your components, eg: UiButton
        prefix: 'Shad',
        // prevent adding another prefix component by it's path.
        pathPrefix: false,
      });
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
  ],
  colorMode: {
    classSuffix: '',
  },
  googleFonts: {
    display: 'swap',
    families: {
      Figtree: [400, 500, 600],
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
});
