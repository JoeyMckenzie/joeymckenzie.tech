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
                // No `plugins` here on purpose -- see CONTEXT.md.
            },
            useCSSLayers: false,
        },
    },
};

export default config;
