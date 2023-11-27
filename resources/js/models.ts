export type ContentMeta = {
    frontMatter: FrontMatter;
    content?: string;
};

export type FrontMatter = {
    slug: string;
    heroImage: string;
    title: string;
    pubDate: string;
    category: string;
    description: string;
    keywords: string[];
    viewCount: number;
};
