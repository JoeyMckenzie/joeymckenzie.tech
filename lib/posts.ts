import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type Post = {
    slug: string;
    title: string;
    description: string;
    pubDate: string;
    heroImage?: string;
    tags: string[];
    readingMinutes: number;
};

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
        // gray-matter yields a Date for an unquoted YAML date, a string for a quoted one.
        pubDate:
            data.pubDate instanceof Date
                ? data.pubDate.toISOString().slice(0, 10)
                : String(data.pubDate),
        heroImage: data.heroImage,
        tags: data.tags ?? [],
        readingMinutes: Math.max(1, Math.ceil(countWords(content) / 200)),
    };
}

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

export function getTags(posts: Post[]) {
    const counts = new Map<string, number>();

    for (const tag of posts.flatMap((post) => post.tags)) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }

    return [...counts]
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => a.tag.localeCompare(b.tag));
}
