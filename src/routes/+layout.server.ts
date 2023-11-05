import { VERCEL_GIT_COMMIT_SHA } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import { getSpotifyNowPlaying } from '$lib/spotify';

export const load: LayoutServerLoad = async () => {
  return {
    commitSha: VERCEL_GIT_COMMIT_SHA,
    nowPlaying: await getSpotifyNowPlaying(),
  };
};
