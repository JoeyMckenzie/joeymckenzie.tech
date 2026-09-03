import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/posts";
import { nav, site } from "@/lib/site";

export const dynamic = "force-static";

// `/archive` is deliberately absent from `nav` (a sixth item overflows the
// header on a narrow screen) but it is a real indexable page, so the sitemap
// lists it explicitly rather than deriving everything from the nav.
const extraRoutes = ["/archive"];

export default function sitemap(): MetadataRoute.Sitemap {
    // `trailingSlash: true`, so `/blog` redirects to `/blog/`. A sitemap that
    // lists the pre-redirect URL is pointing crawlers at a 308 rather than at
    // the canonical page, so every entry is normalised here.
    const pages = [...nav.map((item) => item.href), ...extraRoutes].map(
        (href) => ({
            url: new URL(href.endsWith("/") ? href : `${href}/`, site.url).href,
        })
    );

    const posts = getPosts().map((post) => ({
        url: `${site.url}/blog/${post.slug}/`,
        lastModified: post.pubDate,
    }));

    return [...pages, ...posts];
}
