import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './components/**/*.{vue,ts}',
    './pages/**/*.vue',
    './nuxt.config.ts',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        ubuntu: ['Ubuntu', ...defaultTheme.fontFamily.sans],
        merriweather: ['Merriweather', ...defaultTheme.fontFamily.serif],
        'roboto-mono': ['Roboto Mono', ...defaultTheme.fontFamily.sans],
        'roboto-slab': ['Roboto Slab', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
} satisfies Config;
