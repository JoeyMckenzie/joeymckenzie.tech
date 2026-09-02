import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type Post = {
    /** Filename without the extension, which is also the route segment. */
    slug: string;
    title: string;
    description: string;
    /** `YYYY-MM-DD`. Kept as a string so it survives the RSC boundary intact. */
    pubDate: string;
    heroImage?: string;
    tags: string[];
    readingMinutes: number;
};

// Same formula the astro site used: 200wpm, rounded up, never below one.
// Counting alphabetic runs rather than whitespace-delimited tokens keeps posts
// with box-drawing characters in terminal output from inflating the count.
function countWords(body: string) {
    return body.match(/[A-Za-z'-]+/g)?.length ?? 0;
}

function readPost(filename: string): Post {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
    const { data, content } = matter(raw);

    return {
        slug: filename.replace(/\.mdx?$/, ""),
        title: data.title,
        description: data.description,
        // gray-matter's YAML parse turns an unquoted `2026-08-05` into a Date;
        // a quoted one stays a string. Normalize both to `YYYY-MM-DD`.
        pubDate:
            data.pubDate instanceof Date
                ? data.pubDate.toISOString().slice(0, 10)
                : String(data.pubDate),
        heroImage: data.heroImage,
        tags: data.tags ?? [],
        readingMinutes: Math.max(1, Math.ceil(countWords(content) / 200)),
    };
}

/** Every post, newest first. */
export function getPosts(): Post[] {
    return fs
        .readdirSync(POSTS_DIR)
        .filter((filename) => /\.mdx?$/.test(filename))
        .map(readPost)
        .sort((a, b) => b.pubDate.localeCompare(a.pubDate));
}

export function getPost(slug: string): Post | undefined {
    return getPosts().find((post) => post.slug === slug);
}

/** Tags that actually have posts, alphabetical, with their post counts. */
export function getTags(posts: Post[]) {
    const counts = new Map<string, number>();

    for (const tag of posts.flatMap((post) => post.tags)) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }

    return [...counts]
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => a.tag.localeCompare(b.tag));
}
