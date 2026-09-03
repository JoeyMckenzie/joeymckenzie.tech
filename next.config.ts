import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const appHost = process.env.APP_HOST ?? "joeymckenzie.tech.test";

const nextConfig: NextConfig = {
    // Dev-only: without it the HMR socket is refused and pages never hydrate.
    allowedDevOrigins: [appHost],
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
};

const withMDX = createMDX({
    extension: /\.(md|mdx)$/,
    options: {
        // Strings, not functions: Turbopack serialises this across the Rust boundary.
        remarkPlugins: ["remark-frontmatter", "remark-gfm"],
        rehypePlugins: [
            // `addLanguageClass` is the only way `CodeBlock` learns the
            // language: it is a boolean, so unlike a Shiki transformer it
            // survives the same Rust boundary the plugin names do.
            [
                "@shikijs/rehype",
                { theme: "tokyo-night", addLanguageClass: true },
            ],
            // Slug first -- autolink reads the `id` the previous plugin wrote.
            "rehype-slug",
            [
                "rehype-autolink-headings",
                {
                    behavior: "append",
                    // A hast node rather than a builder function, for the same
                    // serialisation reason. The `#` is hidden from assistive
                    // tech and the label carried on the link, so the anchor
                    // stays keyboard-reachable without every heading being
                    // read out as "number sign".
                    content: {
                        type: "element",
                        tagName: "span",
                        properties: { ariaHidden: "true" },
                        children: [{ type: "text", value: "#" }],
                    },
                    properties: {
                        className: "heading-anchor",
                        ariaLabel: "Link to this section",
                    },
                },
            ],
        ],
    },
});

export default withMDX(nextConfig);
