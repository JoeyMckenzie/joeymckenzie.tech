type SpotifyAuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

const NOW_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player?type=track,episode';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET ?? '';
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN ?? '';

export interface CurrentlyListeningResponse {
  context: CurrentlListeningContext;
  item: CurrentlyListeningItem;
  is_playing: boolean;
}

export interface CurrentlListeningContext {
  external_urls: ExternalUrls;
}

export interface ExternalUrls {
  spotify: string;
}

export interface CurrentlyListeningItem {
  album: Album;
  artists: Artist[];
  show?: Artist;
  images?: Image[];
  name: string;
  external_urls?: ExternalUrls;
}

export interface Album {
  images: Image[];
  name: string;
}

export interface Artist {
  name: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export type ListentingToMeta = {
  albumImage: {
    height: number;
    width: number;
    url: string;
  };
  trackTitle: string;
  artist: string;
  href: string;
};

function getBasicHash() {
  return Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET, 'utf8').toString(
    'base64'
  );
}

async function getSpotifyAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${getBasicHash()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
    next: {
      // Refetch the access token every 10 minutes
      revalidate: 600,
    },
  });

  const spotifyAuthResponse: SpotifyAuthResponse = await response.json();

  return spotifyAuthResponse.access_token;
}

export async function getCurrentlyListeningTo(): Promise<
  ListentingToMeta | undefined
> {
  const token = await getSpotifyAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // We don't want this response cached, my listening habits are sporadic
    cache: 'no-store',
  });

  // Note: 204 will comeback when nothing is playing
  if (response.ok && response.status === 200) {
    const listenToResponse: CurrentlyListeningResponse = await response.json();
    const isTrack = !!listenToResponse.context;

    // Podcasts nest all `context` nodes under the `item` node instead
    if (isTrack) {
      const item = listenToResponse.item;
      const context = listenToResponse.context;

      const albumImage = item.album?.images[0];
      const trackTitle = item?.name;
      const artist = item?.artists[0]?.name;
      const href = context.external_urls?.spotify;

      return {
        albumImage,
        trackTitle,
        artist,
        href,
      };
    } else {
      const item = listenToResponse.item;

      const albumImage = item.images![0];
      const trackTitle = item.name;
      const artist = item.show?.name ?? '';
      const href = item.external_urls?.spotify ?? '';

      return {
        albumImage,
        trackTitle,
        artist,
        href,
      };
    }

    // if (listenToResponse && listenToResponse.item && listenToResponse.context) {
    //   const item = listenToResponse.item;
    //   const context = listenToResponse.context;

    //   const albumImage = item.album?.images[0];
    //   const trackTitle = item?.name;
    //   const artist = item?.artists[0]?.name;
    //   const href = context.external_urls?.spotify;

    //   return {
    //     albumImage,
    //     trackTitle,
    //     artist,
    //     href,
    //   };
    // }
  }
}
