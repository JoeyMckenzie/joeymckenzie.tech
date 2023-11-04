import { CF_PAGES_COMMIT_SHA } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import { getSpotifyNowPlaying } from '$lib/spotify';

export const load: LayoutServerLoad = async () => {
  return {
    commitSha: CF_PAGES_COMMIT_SHA,
    nowPlaying: await getSpotifyNowPlaying(),
  };
};
