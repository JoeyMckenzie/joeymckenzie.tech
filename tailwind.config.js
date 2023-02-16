const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
        ubuntu: ['Ubuntu', ...fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
