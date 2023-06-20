import { writable } from 'svelte/store';

type ViewCountMeta = {
  count: number;
  slug: string;
};

export type ViewCountMetadata = {
  counts: ViewCountMeta[];
};

export type ViewCountStoreState = {
  allBlogs?: ViewCountMetadata | undefined;
  topBlogs?: ViewCountMetadata | undefined;
};

const initialViewCountMetadata: ViewCountMetadata = {
  counts: [],
};

const initialViewCountStoreState: ViewCountStoreState = {
  allBlogs: initialViewCountMetadata,
  topBlogs: initialViewCountMetadata,
};

export const viewCountStore = writable(initialViewCountStoreState);
