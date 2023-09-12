/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/**/*.html', 'node_modules/preline/dist/*.js'],
  plugins: [require('@tailwindcss/forms'), require('preline/plugin')],
};
