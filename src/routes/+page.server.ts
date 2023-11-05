import { dev } from '$app/environment';
import { allPosts } from 'contentlayer/generated';
import type { PageServerLoad } from './$types';
import { compareDesc } from 'date-fns';

export const load = (async () => {
  let posts = allPosts
    .map((p) => ({
      title: p.title,
      description: p.description,
      pubDate: p.pubDate,
      published: p.published,
    }))
    .sort((a, b) => compareDesc(new Date(a.pubDate), new Date(b.pubDate)))
    .slice(0, 3);

  // Filter only NOT DRAFT posts in productive mode
  posts = dev ? posts : posts.filter((post) => !post.published);

  return {
    posts,
  };
}) satisfies PageServerLoad;
