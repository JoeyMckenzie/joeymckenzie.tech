/** @type {import('prettier').Config} */
const config = {
    plugins: ['prettier-plugin-antlers', 'prettier-plugin-tailwindcss'],
    overrides: [
        {
            files: ['*.antlers.html'],
            options: {
                parser: 'antlers',
            },
        },
    ],
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
};

export default config;
