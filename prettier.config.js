/** @type {import('prettier').Config} */
export default {
    plugins: ['@shufo/prettier-plugin-blade'],
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
