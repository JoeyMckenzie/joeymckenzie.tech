import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

// Prerendered to `out/rss.xml` at build time. A static export has no server to
// run this on at request time.
export const dynamic = "force-static";

function escape(value: string) {
    return value.replace(
        /[<>&'"]/g,
        (char) =>
            ({
                "<": "&lt;",
                ">": "&gt;",
                "&": "&amp;",
                "'": "&apos;",
                '"': "&quot;",
            })[char]!
    );
}

export async function GET() {
    const items = getPosts()
        .map(
            (post) => `        <item>
            <title>${escape(post.title)}</title>
            <description>${escape(post.description)}</description>
            <link>${site.url}/blog/${post.slug}/</link>
            <guid>${site.url}/blog/${post.slug}/</guid>
            <pubDate>${new Date(post.pubDate).toUTCString()}</pubDate>
${post.tags.map((tag) => `            <category>${escape(tag)}</category>`).join("\n")}
        </item>`
        )
        .join("\n");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
        <title>${escape(site.title)}</title>
        <description>${escape(site.description)}</description>
        <link>${site.url}/</link>
${items}
    </channel>
</rss>
`;

    return new Response(body, {
        headers: { "Content-Type": "application/xml" },
    });
}
