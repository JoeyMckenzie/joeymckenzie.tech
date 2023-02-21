type SpotifyAuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET ?? '';
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN ?? '';

export interface CurrentlyListeningResponse {
  timestamp: number;
  context: CurrentlListeningContext;
  progress_ms: number;
  item: CurrentlyListeningItem;
  currently_playing_type: string;
  actions: Actions;
  is_playing: boolean;
}

export interface Actions {
  disallows: Disallows;
}

export interface Disallows {
  resuming: boolean;
  skipping_prev: boolean;
}

export interface CurrentlListeningContext {
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface CurrentlyListeningItem {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDS;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: Date;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
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
  });

  // Note: 204 will comeback when nothing is playing
  if (response.ok && response.status === 200) {
    const listenToResponse: CurrentlyListeningResponse = await response.json();

    if (listenToResponse && listenToResponse.item && listenToResponse.context) {
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
    }
  }
}
