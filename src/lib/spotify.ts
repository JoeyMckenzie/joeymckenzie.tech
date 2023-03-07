const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const CLIENT_ID = import.meta.env.SPOTIFY_CLIENT_ID ?? '';
const CLIENT_SECRET = import.meta.env.SPOTIFY_CLIENT_SECRET ?? '';
const REFRESH_TOKEN = import.meta.env.SPOTIFY_REFRESH_TOKEN ?? '';
const NOW_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player?type=track,episode';

type SpotifyAuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export interface CurrentlyListeningResponse {
  timestamp: number;
  context: Context;
  item: Item;
  currently_playing_type: 'episode' | 'track';
}

export interface Context {
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Item {
  album: Album;
  artists: Artist[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  show?: Show;
  images?: Image[];
}

export interface Album {
  artists: Artist[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface ExternalIDS {
  isrc: string;
}

export interface Show {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
}

export type ListeningToMeta = {
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
  });

  const spotifyAuthResponse: SpotifyAuthResponse = await response.json();

  return spotifyAuthResponse.access_token;
}

export async function getCurrentlyListeningTo() {
  const token = await getSpotifyAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Note: 204 will comeback when nothing is playing
  if (response.ok && response.status === 200) {
    const listeningToResponse: CurrentlyListeningResponse =
      await response.json();

    // Podcasts nest all `context` nodes under the `item` node instead
    if (listeningToResponse.currently_playing_type === 'track') {
      const item = listeningToResponse.item;
      const context = listeningToResponse.context;

      const albumImage = item.album?.images[0]!;
      const trackTitle = item?.name;
      const artist = item?.artists ? item.artists[0]?.name! : '';
      const href = context.external_urls?.spotify;

      return {
        albumImage,
        trackTitle,
        artist,
        href,
      } satisfies ListeningToMeta;
    } else {
      const item = listeningToResponse.item;

      const albumImage = item.images![0]!;
      const trackTitle = item.name;
      const artist = item.show?.name ?? '';
      const href = item.external_urls?.spotify ?? '';

      return {
        albumImage,
        trackTitle,
        artist,
        href,
      } satisfies ListeningToMeta;
    }
  }

  return null;
}
