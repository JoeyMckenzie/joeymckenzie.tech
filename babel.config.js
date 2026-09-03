const path = require("path");

// StyleX is a compiler: `stylex.create` calls are read at build time and their
// CSS is extracted, so nothing here is optional -- without this plugin the
// calls survive into the bundle and paint nothing.
//
// No `presets`. The StyleX docs tell you to add `next/babel`, but that is
// webpack-era advice: Turbopack (the default bundler since Next 16) detects
// this file, runs Babel with it, and still runs SWC for Next's own transforms
// and downleveling. The preset would re-do work SWC has already done. See
// node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md.
//
// Dropping the preset does mean Babel no longer knows how to *read* TypeScript
// or JSX, and every file it sees here is one or both -- it fails on the first
// `import type`. `parserOpts` turns the syntax back on without adding a
// transform: Babel parses, the StyleX plugin does its work, and the types and
// JSX pass through untouched for SWC to strip downstream. `jsx` is scoped to
// `.tsx` because in a `.ts` file it makes the parser read the `<T>` in
// `<T>(x: T) => x` as an unclosed JSX tag.
module.exports = {
    parserOpts: { plugins: ["typescript"] },
    overrides: [
        { test: /\.tsx$/, parserOpts: { plugins: ["typescript", "jsx"] } },
    ],
    plugins: [
        [
            "@stylexjs/babel-plugin",
            {
                // Readable class names and a source map back to the
                // `stylex.create` that produced them. Off in production, where
                // the point is the shortest possible atomic class.
                dev: process.env.NODE_ENV !== "production",
                // The site is a static export, so there is no server runtime to
                // inject styles from. Everything ships as extracted CSS.
                runtimeInjection: false,
                enableInlinedConditionalMerge: true,
                // Style objects look unused to a bundler -- they are consumed by
                // the compiler, not by runtime code -- so tree-shaking drops
                // them unless this compensates.
                treeshakeCompensation: true,
                // Must track `paths` in tsconfig.json. If these disagree, an
                // import of `@/app/tokens.stylex` resolves to nothing and its
                // variables silently compile away.
                aliases: { "@/*": [path.join(__dirname, "*")] },
                unstable_moduleResolution: { type: "commonJS" },
            },
        ],
    ],
};
