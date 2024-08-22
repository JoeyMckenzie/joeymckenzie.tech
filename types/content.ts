import { z } from 'zod';

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

export const frontMatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.string().regex(/^[A-Z][a-z]{2}\s\d{2}\s\d{4}$/, 'Invalid date format. Expected MMM DD YYYY'),
  heroImage: z.string(),
  category: z.string(),
  keywords: z.array(z.string()).nonempty(),
});

export type FrontMatter = z.infer<typeof frontMatterSchema>;
