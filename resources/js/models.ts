export type ContentMeta = {
    frontMatter: FrontMatter;
    content?: string;
};

export type FrontMatter = {
    slug: string;
    hero_image: string;
    title: string;
    published_date: string;
    category: string;
    description: string;
    keywords: string;
    views: number;
};

export type Post = FrontMatter & {
    parsed_content: string;
};
