import { addViewCount } from '$lib/db';
import { error } from '@sveltejs/kit';
import { allPosts } from 'contentlayer/generated';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  // No need to block the page from rendering to add a view count, so lose the `await` here
  addViewCount(params.slug).catch((e) => {
    console.error('error while attempting to add view count', e);
  });

  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

  if (!post) {
    throw error(404, 'blog not found');
  }

  return {
    post,
  };
};
