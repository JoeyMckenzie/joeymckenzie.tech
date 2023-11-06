import { defineEventHandler } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/h3/dist/index.mjs';
import { u as useRuntimeConfig } from './nitro/nitro-prerenderer.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ofetch/dist/node.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/destr/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/hookable/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/scule/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/klona/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/defu/dist/defu.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ohash/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ufo/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/memory.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/pathe/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/shikiji/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unified/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/mdast-util-to-string/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unist-util-stringify-position/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-character/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-chunked/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-resolve-all/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-sanitize-uri/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/slugify/slugify.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-parse/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-rehype/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-mdc/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/hast-util-to-string/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/github-slugger/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/detab/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-emoji/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-gfm/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-external-links/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-sort-attribute-values/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-sort-attributes/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-raw/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unist-util-visit/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/feed/lib/feed.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ipx/dist/index.mjs';

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
