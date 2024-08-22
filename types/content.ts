export interface Post {
  slug: string;
  pubDate: string;
  category: string;
  views: number;
  title: string;
  description: string;
  heroImage: string;
  content: string;
}

export type PostPreview = Omit<Post, 'heroImage' | 'content'>;

export interface FrontMatter {
  title: string;
  description: string;
  pubDate: string;
  heroImage: string;
  category: string;
  keywords: string[];
}
