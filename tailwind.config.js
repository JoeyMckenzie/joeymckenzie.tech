import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
import daisy from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
    },
  },

  daisyui: {
    themes: ['dim'],
  },

  plugins: [forms, daisy],
}
