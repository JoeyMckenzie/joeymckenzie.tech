import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores(["dist/", ".astro/", ".devenv/", ".direnv/"]),
    js.configs.recommended,
    tseslint.configs.recommended,
    astro.configs["flat/recommended"],
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
    },
]);
