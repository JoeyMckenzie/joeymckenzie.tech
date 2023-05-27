import { writable } from 'svelte/store';

type ViewCountMeta = {
  count: number;
  slug: string;
};

const initialViewCountMetadata: ViewCountMeta[] = [];

function createCount() {
  const { subscribe, set, update } = writable(initialViewCountMetadata);

  return {
    subscribe,
  };
}

export const count = createCount();
