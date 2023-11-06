import { VERCEL_GIT_COMMIT_SHA } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import { getSpotifyNowPlaying } from '$lib/spotify';
import { getViewCounts, type ViewCountQuery } from '$lib/db';
import { loadInitialPostPreviews } from '$lib/posts';

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
    postPreviews: await loadInitialPostPreviews(viewCounts),
  };
};
