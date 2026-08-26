import { getCollection } from "astro:content"
import rss from "@astrojs/rss"
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts"

export async function GET(context) {
    const posts = (await getCollection("blog")).sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    )
    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.pubDate,
            categories: post.data.tags,
            link: `/blog/${post.id}/`,
        })),
    })
}
