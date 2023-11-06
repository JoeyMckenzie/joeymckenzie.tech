import { writable } from 'svelte/store';
import type { PostWithViewCount } from './types';

type ViewCountState = {
  latest: PostWithViewCount[];
  all: PostWithViewCount[];
};

export const viewCountStore = writable<ViewCountState>({
  latest: [],
  all: [],
});
