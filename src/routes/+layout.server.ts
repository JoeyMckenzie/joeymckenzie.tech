import { VERCEL_COMMIT_REF } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import { getSpotifyNowPlaying } from '$lib/spotify';

export const load: LayoutServerLoad = async () => {
  return {
    commitSha: VERCEL_COMMIT_REF,
    nowPlaying: await getSpotifyNowPlaying(),
  };
};
