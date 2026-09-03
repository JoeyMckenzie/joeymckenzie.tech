import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylex from "@stylexjs/eslint-plugin";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        files: ["babel.config.js"],
        rules: { "@typescript-eslint/no-require-imports": "off" },
    },
    {
        plugins: { "@stylexjs": stylex },
        rules: {
            "@stylexjs/valid-styles": "error",
            "@stylexjs/no-unused": "error",
            "@stylexjs/valid-shorthands": "warn",
        },
    },
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
