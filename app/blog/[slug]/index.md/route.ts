import { getPostSource, getPosts } from "@/lib/posts";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
    return getPosts().map((post) => ({ slug: post.slug }));
}

// A literal `.md` segment, the same trick `app/rss.xml` uses: only whole
// segments can be dynamic, so `/blog/<slug>.md` is not expressible and the
// extension has to live one level down.
export async function GET(
    _request: Request,
    { params }: RouteContext<"/blog/[slug]/index.md">
) {
    const { slug } = await params;

    // This header only ever applies under `next dev`. A static export writes
    // the body to disk and throws the response away, so in production the
    // content type comes from Cloudflare's MIME table via the `.md` extension.
    return new Response(getPostSource(slug), {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
}
