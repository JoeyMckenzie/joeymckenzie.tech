import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/posts";
import { nav, site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = nav.map((item) => ({
        url: new URL(item.href, site.url).href,
    }));

    const posts = getPosts().map((post) => ({
        url: `${site.url}/blog/${post.slug}/`,
        lastModified: post.pubDate,
    }));

    return [...pages, ...posts];
}
