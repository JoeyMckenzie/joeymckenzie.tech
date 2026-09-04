import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

// `draft: true` in the frontmatter hides a post everywhere `getPosts` feeds:
// the index, the archive, the feed, the sitemap, `llms.txt`, and
// `generateStaticParams`, which is what denies it a route.
//
// `next dev` sets NODE_ENV to "development" and `next build` sets it to
// "production", so a draft is readable at its real URL while it is being
// written and absent from anything that deploys. Read once at module scope, so
// there is one place to look when a draft does not show up where expected.
//
// The file compiles either way: the post route's dynamic import is a context
// module over the whole directory. That is a few KB in the bundle rather than a
// leak, since in production nothing renders it.
const SHOW_DRAFTS = process.env.NODE_ENV === "development";

export type Post = {
    slug: string;
    title: string;
    description: string;
    pubDate: string;
    heroImage?: string;
    tags: string[];
    readingMinutes: number;
    draft: boolean;
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
        draft: data.draft === true,
    };
}

export function getPosts(): Post[] {
    return fs
        .readdirSync(POSTS_DIR)
        .filter((filename) => /\.mdx?$/.test(filename))
        .map(readPost)
        .filter((post) => SHOW_DRAFTS || !post.draft)
        .sort((a, b) => b.pubDate.localeCompare(a.pubDate));
}

export function getPost(slug: string): Post | undefined {
    return getPosts().find((post) => post.slug === slug);
}

// The file on disk, frontmatter and all. `/blog/<slug>/index.md` serves this
// verbatim, so a reader who prefers `curl` gets exactly what the post is
// written from rather than a reconstruction of it.
export function getPostSource(slug: string): string {
    return fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
}

// `older` / `newer` rather than previous / next: the list is sorted by date, so
// direction is the only thing a reader can actually predict from the label.
export function getPostNeighbors(slug: string) {
    const posts = getPosts();
    const index = posts.findIndex((post) => post.slug === slug);

    return {
        newer: index > 0 ? posts[index - 1] : undefined,
        older: index >= 0 ? posts[index + 1] : undefined,
    };
}

// Newest year first, and posts within a year stay in the order `getPosts`
// already put them in.
export function getPostsByYear(posts: Post[]) {
    const years = new Map<string, Post[]>();

    for (const post of posts) {
        const year = post.pubDate.slice(0, 4);
        years.set(year, [...(years.get(year) ?? []), post]);
    }

    return [...years].map(([year, entries]) => ({ year, posts: entries }));
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
