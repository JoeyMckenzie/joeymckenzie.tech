/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.rs', './src/*.rs'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
