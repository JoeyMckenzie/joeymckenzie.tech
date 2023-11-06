import { VERCEL_GIT_COMMIT_SHA } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import { getSpotifyNowPlaying } from '$lib/spotify';
import { getViewCounts } from '$lib/db';
import { loadInitialPostPreviews } from '$lib/posts';

export const load: LayoutServerLoad = async () => {
  const viewCounts = await getViewCounts();
  return {
    commitSha: VERCEL_GIT_COMMIT_SHA,
    nowPlaying: await getSpotifyNowPlaying(),
    postPreviews: await loadInitialPostPreviews(viewCounts),
  };
};
