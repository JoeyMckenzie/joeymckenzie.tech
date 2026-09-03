import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export const dynamic = "force-static";

// Hand-written rather than the one favicon.io generates alongside the icons:
// that file ships empty `name` / `short_name` and a white theme, which would
// paint an Android status bar white above a near-black page. The colours are
// literals for the same reason `console-signature` uses them -- a manifest is
// JSON, so there is no StyleX variable to read. They mirror `background` in
// `tokens.stylex.ts`.
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: site.title,
        short_name: site.title,
        description: site.description,
        start_url: "/",
        // Not `standalone`. Installed to a home screen that way, the site would
        // lose the back button and the URL bar -- on a blog whose posts are
        // largely outbound links, that is a trap rather than an app.
        display: "minimal-ui",
        background_color: "#0e0d0c",
        theme_color: "#0e0d0c",
        // No `purpose: "maskable"` on either: these are the plain square icons
        // favicon.io emits, and declaring them maskable would let a launcher
        // crop the artwork to a circle on the assumption of a safe margin that
        // is not there.
        icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
