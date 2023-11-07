import { dev } from '$app/environment';
import { VERCEL_GIT_COMMIT_SHA } from '$env/static/private';
import { getViewCounts, type ViewCountQuery } from '$lib/db';
import { getSpotifyNowPlaying } from '$lib/spotify';
import type { PostWithViewCount } from '$lib/types';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  let viewCounts: ViewCountQuery[] = [];

  try {
    viewCounts = await getViewCounts();
  } catch (e) {
    console.error('error while retrieving view counts', e);
  }

  return {
    commitSha: VERCEL_GIT_COMMIT_SHA,
    nowPlaying: await getSpotifyNowPlaying(),
    postPreviews: loadInitialPostPreviews(viewCounts),
  };
};

function loadInitialPostPreviews(viewCounts: ViewCountQuery[]) {
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
