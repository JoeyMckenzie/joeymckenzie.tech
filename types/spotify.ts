export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
}

export interface NowPlaying {
  href?: string;
  albumImageSrc?: string;
  trackTitle?: string;
  artist?: string;
  nowPlaying: boolean;
}

export interface SpotifyAuthResponse {
  access_token: string;
}

export interface ContextUrls {
  spotify: string;
}

export interface Context {
  external_urls: ContextUrls;
}
export interface Image {
  url: string;
}

export interface Artist {
  name: string;
}

export interface Album {
  name: string;
  images: Image[];
}

export interface Show {
  name: string;
  images: Image[];
}

export interface Item {
  name: string;
  album: Album;
  show: Show;
  artists: Artist[];
}

export interface SpotifyNowPlayingResponse {
  currently_playing_type: string;
  context: Context;
  item: Item;
}
