/** @type {import('prettier').Config} */
const config = {
    plugins: ['prettier-plugin-tailwindcss', '@shufo/prettier-plugin-blade'],
    overrides: [
        {
            files: ['*.blade.php'],
            options: {
                parser: 'blade',
                tabWidth: 4,
                wrapAttributes: 'auto',
                sortTailwindcssClasses: true,
                sortHtmlAttributes: 'code-guide',
                noPhpSyntaxCheck: false,
            },
        },
    ],
    tailwindConfig: './tailwind.config.js',
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
}

export default config
