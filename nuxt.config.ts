import { resolve } from 'node:path';
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
    '@nuxt/image',
    '@nuxt/content',
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
  content: {
    sources: {
      content: {
        driver: 'fs',
        prefix: '/blog',
        base: resolve(__dirname, 'content'),
      },
    },
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
    icons: ['mdi', 'hugeicons', 'logos', 'bxl'],
  },
});
