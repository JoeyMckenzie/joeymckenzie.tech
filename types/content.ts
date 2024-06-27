import type { ParsedContent } from '@nuxt/content';

export type PostPreviewQuery = Pick<ParsedPostContent, '_path' | 'title' | 'description' | 'pubDate' | 'category'>;

export interface ParsedPostContent extends ParsedContent {
  _path: string;
  title: string;
  description: string;
  pubDate: string;
}

export interface MergedPostContent extends PostPreviewQuery {
  views: number;
}
