import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { getViewCounts } from './db';
import { PostWithViewCount } from './types';

export async function getPostPreviews(includeLatest = false) {
  const viewCounts = await getViewCounts();

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

  if (includeLatest) {
    posts = posts.slice(0, 3);
  }

  return {
    posts,
  };
}
