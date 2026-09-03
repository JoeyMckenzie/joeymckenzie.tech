import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// https://llmstxt.org -- a markdown index of the site, pointing at the raw
// markdown of each post rather than at the rendered page.
export async function GET() {
    const posts = getPosts()
        .map(
            (post) =>
                `- [${post.title}](${site.url}/blog/${post.slug}/index.md): ${post.description}`
        )
        .join("\n");

    const body = `# ${site.title}

> ${site.description}

Written by ${site.author}. Every post below links to its markdown source; the
rendered page is at the same path without \`index.md\`.

## Posts

${posts}
`;

    // Dev-only, like the one on the raw-markdown route: the export keeps the
    // body and Cloudflare types the file by its `.txt` extension.
    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
