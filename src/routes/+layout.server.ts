import { dev } from '$app/environment';
import { VERCEL_GIT_COMMIT_SHA } from '$env/static/private';
import { getViewCounts, type ViewCountQuery } from '$lib/db';
import { getSpotifyNowPlaying, type NowPlayingResponse } from '$lib/spotify';
import type { PostWithViewCount } from '$lib/types';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  let viewCounts: ViewCountQuery[] = [];
  let nowPlaying: NowPlayingResponse | undefined;

  try {
    [viewCounts, nowPlaying] = await Promise.all([
      getViewCounts(),
      getSpotifyNowPlaying(),
    ]);
  } catch (e) {
    console.error('error while retrieving view counts', e);
  }

  return {
    commitSha: VERCEL_GIT_COMMIT_SHA,
    nowPlaying,
    postPreviews: loadInitialPostPreviews(viewCounts),
  };
};

function loadInitialPostPreviews(viewCounts: ViewCountQuery[]) {
  const posts = allPosts
    // During local dev, allow all the files including draft to be available
    // In production, only show the published posts not in the draft directory
    .filter((p) => (dev ? true : !p.draft))
    // We don't most of the post data that ContentLayer generates,
    // just pluck a few things for the displaying the preview card
    .map((p) => {
      const { pubDate, title, category, description, url } = p;
      return {
        viewCount: viewCounts.find((vc) => p._id.includes(vc.slug))?.count ?? 0,
        pubDate,
        title,
        category,
        description,
        url,
      } satisfies PostWithViewCount;
    })
    .sort((a, b) => compareDesc(new Date(a.pubDate), new Date(b.pubDate)));

  return posts;
}
