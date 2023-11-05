export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
};

export type NowPlaying = {
  href?: string;
  albumImageSrc?: string;
  trackTitle?: string;
  artist?: string;
  nowPlaying: boolean;
};

export type SpotifyAuthResponse = {
  access_token: string;
};

export type ContextUrls = {
  spotify: string;
};

export type Context = {
  external_urls: ContextUrls;
};
export type Image = {
  url: string;
};

export type Artist = {
  name: string;
};

export type Album = {
  name: string;
  images: Image[];
};

export type Show = {
  name: string;
  images: Image[];
};

export type Item = {
  name: string;
  album: Album;
  show: Show;
  artists: Artist[];
  external_urls: {
    spotify: string;
  };
};

export type SpotifyNowPlayingResponse = {
  currently_playing_type: string;
  context: Context;
  item: Item;
};
