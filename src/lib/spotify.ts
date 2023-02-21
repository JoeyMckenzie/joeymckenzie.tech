type SpotifyAuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const BASIC_HASH = Buffer.from(
  CLIENT_ID + ':' + CLIENT_SECRET,
  'utf8'
).toString('base64');

export async function getSpotifyAccessToken() {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${BASIC_HASH}`,
  };

  const spotifyResponse = await fetch(TOKEN_ENDPOINT, {
    headers,
    method: 'post',
    body: 'grant_type=client_credentials',
  });
  const response: SpotifyAuthResponse = await spotifyResponse.json();

  return response.access_token;
}
