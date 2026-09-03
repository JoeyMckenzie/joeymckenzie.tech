const config = {
    plugins: {
        "@stylexjs/postcss-plugin": {
            include: [
                "app/**/*.{js,jsx,ts,tsx}",
                "components/**/*.{js,jsx,ts,tsx}",
                "lib/**/*.{js,jsx,ts,tsx}",
                "mdx-components.tsx",
            ],
            babelConfig: {
                babelrc: false,
                parserOpts: { plugins: ["typescript", "jsx"] },
                // Deliberately no `plugins` here, though the StyleX docs import
                // them from `babel.config.js` and pass them through. Turbopack
                // serialises this config across its Rust boundary and rewrites
                // every project-root path in it to the literal string `/ROOT/`
                // -- which turns the plugin's `aliases` into `{"@/*":
                // ["/ROOT/*"]}` and leaves it unable to resolve
                // `@/app/tokens.stylex`. Omitting `plugins` lets Babel load
                // `babel.config.js` itself, inside the worker, where
                // `__dirname` is a real path.
            },
            // Left at `false` now that Tailwind is gone. There is still
            // hand-written CSS in `app/globals.css` -- the element defaults and
            // the prose stylesheet -- and unlayered StyleX outranking an
            // element-level rule is the behaviour we want. Layering it would
            // invert that and let a stray `body {}` rule beat a component.
            useCSSLayers: false,
        },
    },
};

export default config;
