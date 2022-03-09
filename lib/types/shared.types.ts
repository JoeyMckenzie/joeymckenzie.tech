import { Dispatch, SetStateAction } from 'react';

export interface FrontMatter {
  title: string;
  slug: string;
  domains: string[];
  description: string;
  date: string;
  datetime: string;
  readingTime: string;
  viewCount?: number;
}

export interface NavigationLink {
  href: string;
  name: string;
}

export interface ViewsApiResponse {
  total: string;
}

export interface CodeSnippet {
  title: string;
}

export type ContextDispatch<T> = Dispatch<SetStateAction<T>>;
