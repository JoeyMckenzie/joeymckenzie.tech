import { allPosts } from 'contentlayer/generated';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  return {
    post: allPosts.find((post) => post._raw.flattenedPath === params.slug),
  };
};
