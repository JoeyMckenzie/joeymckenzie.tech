const path = require("path");

// No `presets` and `jsx` scoped to `.tsx`, both deliberate -- see CONTEXT.md.
module.exports = {
    parserOpts: { plugins: ["typescript"] },
    overrides: [
        { test: /\.tsx$/, parserOpts: { plugins: ["typescript", "jsx"] } },
    ],
    plugins: [
        [
            "@stylexjs/babel-plugin",
            {
                dev: process.env.NODE_ENV !== "production",
                runtimeInjection: false,
                enableInlinedConditionalMerge: true,
                treeshakeCompensation: true,
                // Must track `paths` in tsconfig.json.
                aliases: { "@/*": [path.join(__dirname, "*")] },
                unstable_moduleResolution: { type: "commonJS" },
            },
        ],
    ],
};
