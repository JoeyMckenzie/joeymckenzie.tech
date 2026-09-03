import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylex from "@stylexjs/eslint-plugin";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        // Babel loads `babel.config.js` as CommonJS -- package.json declares no
        // `"type": "module"` -- so `require` is the only thing that works here.
        files: ["babel.config.js"],
        rules: { "@typescript-eslint/no-require-imports": "off" },
    },
    {
        // StyleX fails silently: an invalid property or a style object nothing
        // reads compiles to no CSS rather than to an error, so these rules are
        // the only thing between a typo and an unstyled element in production.
        plugins: { "@stylexjs": stylex },
        rules: {
            "@stylexjs/valid-styles": "error",
            "@stylexjs/no-unused": "error",
            "@stylexjs/valid-shorthands": "warn",
            // `sort-keys` is deliberately off. It wants style keys in
            // alphabetical order, which scrambles the grouping these blocks are
            // written in -- layout, then box, then type, then state -- and that
            // grouping is what makes a 30-property style readable at a glance.
            // The rule earns its keep on a large team as merge-conflict
            // insurance; there is no team here.
        },
    },
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
]);

export default eslintConfig;
