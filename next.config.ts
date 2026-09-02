import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const appHost = process.env.APP_HOST ?? "joeymckenzie.tech.test";

const nextConfig: NextConfig = {
    // `next dev` blocks its own dev-only assets for any origin it was not
    // started on. The HMR socket is the one that matters: refused, it stalls
    // the Turbopack dev bootstrap, so pages render server HTML and then never
    // hydrate -- every click handler silently dead. Dev-only; `next build`
    // ignores it.
    allowedDevOrigins: [appHost],
    // Cloudflare serves the `out/` directory as plain static files. No server
    // runtime means no route handlers that read the request, no server
    // actions, and no server-side `searchParams`.
    output: "export",
    // The astro site linked posts as `/blog/<slug>/`, so keep the trailing
    // slash and inbound links stay valid.
    trailingSlash: true,
    // The default image loader needs a server; a static export has none.
    images: { unoptimized: true },
};

const withMDX = createMDX({
    // Every post is `.md`. `@mdx-js/loader` is format-aware, so a `.md` file is
    // parsed as plain markdown -- no JSX, which matters because the posts are
    // full of raw `<` and `{` in code and prose.
    extension: /\.(md|mdx)$/,
    options: {
        // Turbopack can't accept plugin functions across the Rust boundary, so
        // plugins are named as strings with serializable options.
        remarkPlugins: [
            // Strips the YAML block. `lib/posts.ts` is what actually reads it.
            "remark-frontmatter",
            // Tables and `~~strikethrough~~`, both of which posts use.
            "remark-gfm",
        ],
        rehypePlugins: [["@shikijs/rehype", { theme: "tokyo-night" }]],
    },
});

export default withMDX(nextConfig);
