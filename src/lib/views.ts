import type { PostWithViewCount } from './types';

export default function createViewCounts(posts: PostWithViewCount[]) {
  const viewCounts = $state(posts);
  const latest = $derived(posts.slice(0, 3));

  return {
    get all() {
      return viewCounts;
    },
    get latest() {
      return latest;
    },
  };
}

export type ViewCountStore = ReturnType<typeof createViewCounts>;
