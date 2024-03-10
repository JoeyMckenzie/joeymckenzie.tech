import { Config } from 'ziggy-js';

export type FrontMatter = {
    slug: string;
    published_date: string;
    category: string;
    description: string;
    title: string;
};

export type Post = Omit<FrontMatter, 'description'> & {
    hero_image: string;
    parsed_content: string;
};

export type Note = {
    title: string;
    description: string;
};

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
