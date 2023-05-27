import { writable } from 'svelte/store';

type ViewCountMeta = {
  count: number;
  slug: string;
};

export type ViewCountMetadata = {
  counts: ViewCountMeta[];
};

const initialViewCountMetadata: ViewCountMeta[] = [];

export const viewCountStore = writable(initialViewCountMetadata);
