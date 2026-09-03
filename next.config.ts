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
        rehypePlugins: [["@shikijs/rehype", { theme: "tokyo-night" }]],
    },
});

export default withMDX(nextConfig);
