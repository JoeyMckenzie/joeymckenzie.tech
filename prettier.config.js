/**
 * @type {import("prettier").Config}
 */
const config = {
    trailingComma: "es5",
    tabWidth: 4,
    semi: false,
    singleQuote: false,
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
}

export default config
