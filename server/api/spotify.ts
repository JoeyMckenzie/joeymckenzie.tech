// TODO: One of these I'm gonna figure out how to use the Spotify TS SDK, though that day is not today...

import { Buffer } from 'node:buffer';

import type {
  AccessTokenResponse,
  NowPlaying,
  SpotifyNowPlayingResponse,
} from '~~/types/spotify';

export default defineEventHandler(async (): Promise<NowPlaying> => {
  const { spotifyClientSecret, spotifyClientId, spotifyRefreshToken, tokenEndpoint, nowPlayingEndpoint } = useRuntimeConfig();

  const { access_token: accessToken, token_type: tokenType }
    = await $fetch<AccessTokenResponse>(tokenEndpoint, {
      method: 'POST',
      headers: getRequestHeaders(
        spotifyClientId,
        spotifyClientSecret,
      ),
      body: getRequestBody(spotifyRefreshToken),
    });

  const nowPlayingResponse = await $fetch<SpotifyNowPlayingResponse>(
    nowPlayingEndpoint,
    {
      method: 'GET',
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    },
  );

  // Spotify returned a 204, so no content === not playing anything
  if (!nowPlayingResponse) {
    return {
      nowPlaying: false,
    };
  }

  // Most of the linking and track/show information come from the `item` and `context` node and we can largely ignore the majority of the response
  const item = nowPlayingResponse.item;
  const context = nowPlayingResponse.context;
  const trackTitle = item.name;
  const href = context?.external_urls?.spotify ?? '/';

  // The playing type will either be `"show"` or `"track"` based on a podcast or artist song
  // There's _a lot_ of presumptive `unwrap()`ing going here, should probably clean up eventually
  if (nowPlayingResponse.currently_playing_type === 'track') {
    const albumImage = item.album.images[0];
    const artist = item.artists[0].name;

    return {
      albumImageSrc: albumImage.url,
      artist,
      href,
      trackTitle,
      nowPlaying: true,
    };
  }
  else {
    const show = item.show;
    const showImage = show.images[0];
    const showTitle = show.name;

    return {
      albumImageSrc: showImage.url,
      artist: showTitle,
      href,
      trackTitle,
      nowPlaying: true,
    };
  }
});

function getRequestHeaders(clientId: string, clientSecret: string) {
  const headers = new Headers();
  headers.set(
    'Authorization',
    `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
  );
  return headers;
}

function getRequestBody(refreshToken: string) {
  return new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
}
