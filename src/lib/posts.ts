import { allPosts } from 'contentlayer/generated';
import type { PostWithViewCount } from '$lib/types';
import { compareDesc } from 'date-fns';
import { dev } from '$app/environment';

export async function loadInitialPostPreviews(
  viewCounts: { slug: string; count: number }[],
) {
  let posts = allPosts
    .map(
      (p) =>
        ({
          viewCount:
            viewCounts.find((vc) => p._id.includes(vc.slug))?.count ?? 0,
          ...p,
        }) satisfies PostWithViewCount,
    )
    .sort((a, b) => compareDesc(new Date(a.pubDate), new Date(b.pubDate)));

  // Only include published posts in production, allowing us to work on posts in a draft status
  posts = dev ? posts : posts.filter((post) => !post.draft);

  return posts;
}
