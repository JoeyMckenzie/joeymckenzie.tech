import { fontFamily } from 'tailwindcss/defaultTheme';

export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    preset: 'netlify',
  },
  ssr: false,
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/content',
    '@pinia/nuxt',
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
    public: {
      commitSha: '',
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
  content: {
    ignores: ['/content/draft'],
    highlight: {
      theme: 'vitesse-dark',
      langs: [
        'php',
        'csharp',
        'sql',
        'zig',
        'rust',
        'hcl',
        'toml',
        'bash',
        'shell',
        'yaml',
        'go',
        'dockerfile',
        'makefile',
        'ts',
        'typescript',
        'tsx',
        'json',
        'js',
        'html',
        'xml',
      ],
    },
  },
  colorMode: {
    classSuffix: '',
  },
  ui: {
    icons: ['mdi', 'hugeicons', 'simple-icons', 'logos', 'bxl'],
  },
});
