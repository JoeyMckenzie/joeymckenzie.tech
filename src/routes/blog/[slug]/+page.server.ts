import { allPosts } from 'contentlayer/generated';
import type { PageServerLoad } from './$types';
import { addViewCount } from '$lib/db';

export const load: PageServerLoad = ({ params }) => {
  // No need to block the page from rendering to add a view count, so lose the `await` here
  addViewCount(params.slug);

  return {
    post: allPosts.find((post) => post._raw.flattenedPath === params.slug),
  };
};
