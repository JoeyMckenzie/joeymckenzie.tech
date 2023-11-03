import { d as defineEventHandler, u as useRuntimeConfig } from './nitro/netlify.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'shikiji';
import 'unified';
import 'mdast-util-to-string';
import 'micromark';
import 'unist-util-stringify-position';
import 'micromark-util-character';
import 'micromark-util-chunked';
import 'micromark-util-resolve-all';
import 'micromark-util-sanitize-uri';
import 'slugify';
import 'remark-parse';
import 'remark-rehype';
import 'remark-mdc';
import 'hast-util-to-string';
import 'github-slugger';
import 'detab';
import 'remark-emoji';
import 'remark-gfm';
import 'rehype-external-links';
import 'rehype-sort-attribute-values';
import 'rehype-sort-attributes';
import 'rehype-raw';
import 'unist-util-visit';
import 'feed';
import 'node:url';
import 'ipx';

const spotify = defineEventHandler(async () => {
  var _a, _b;
  const config = useRuntimeConfig();
  const { access_token: accessToken, token_type: tokenType } = await $fetch(config.app.spotifyTokenEndpoint, {
    method: "POST",
    headers: getRequestHeaders(
      config.app.spotifyClientId,
      config.app.spotifyClientSecret
    ),
    body: getRequestBody(config.app.spotifyRefreshToken)
  });
  const nowPlayingResponse = await $fetch(
    config.app.spotifyNowPlayingEndpoint,
    {
      method: "GET",
      headers: {
        Authorization: `${tokenType} ${accessToken}`
      }
    }
  );
  if (!nowPlayingResponse) {
    return {
      nowPlaying: false
    };
  }
  const item = nowPlayingResponse.item;
  const context = nowPlayingResponse.context;
  const trackTitle = item.name;
  const href = (_b = (_a = context == null ? void 0 : context.external_urls) == null ? void 0 : _a.spotify) != null ? _b : "/";
  if (nowPlayingResponse.currently_playing_type === "track") {
    const albumImage = item.album.images[0];
    const artist = item.artists[0].name;
    return {
      albumImageSrc: albumImage.url,
      artist,
      href,
      trackTitle,
      nowPlaying: true
    };
  } else {
    const show = item.show;
    const showImage = show.images[0];
    const showTitle = show.name;
    return {
      albumImageSrc: showImage.url,
      artist: showTitle,
      href,
      trackTitle,
      nowPlaying: true
    };
  }
});
function getRequestHeaders(clientId, clientSecret) {
  const headers = new Headers();
  headers.set(
    "Authorization",
    "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64")
  );
  return headers;
}
function getRequestBody(refreshToken) {
  return new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken
  });
}

export { spotify as default };
//# sourceMappingURL=spotify.mjs.map
