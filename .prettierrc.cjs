/** @type {import('prettier').Config} */
module.exports = {
  singleQuote: true,
  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-astro',
    'prettier-plugin-svelte',
  ],
  pluginSearchDirs: ['.'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
