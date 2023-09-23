export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
};

export type NowPlaying = {
  href: string;
  albumImageSrc: string;
  trackTitle: string;
  artist: string;
  nowPlaying: boolean;
};
