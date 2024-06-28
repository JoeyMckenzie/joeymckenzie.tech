import type { ParsedContent } from '@nuxt/content';

export type PostContent = Pick<ParsedContent, 'body' | '_path' | 'title' | 'description' | 'pubDate' | 'category' | 'heroImage'>;

export type PostPreview = Omit<PostContent, 'body' | 'heroImage'> & { views: number };

export interface ParsedPostContent extends ParsedContent {
  _path: string;
  title: string;
  description: string;
  pubDate: string;
}

export interface MergedPostContent extends PostContent {
  views: number;
}
