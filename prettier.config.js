/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    plugins: ['@shufo/prettier-plugin-blade', 'prettier-plugin-tailwindcss'],
    overrides: [
        {
            files: ['*.blade.php'],
            options: {
                parser: 'blade',
                tabWidth: 4,
            },
        },
    ],
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
};

export default config;
