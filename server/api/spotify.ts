// TODO: One of these I'm gonna figure out how to use the Spotify TS SDK, though that day is not today...

type AccessTokenResponse = {
  access_token: string;
};

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const { access_token: accessToken } = await $fetch<AccessTokenResponse>(
    config.app.spotifyTokenEndpoint,
    {
      method: 'POST',
      headers: getRequestHeaders(
        config.app.spotifyClientId,
        config.app.spotifyClientSecret,
      ),
      body: getRequestBody(config.app.spotifyRefreshToken),
    },
  );

  console.log(accessToken);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nowPlayingResponse = await $fetch(
    config.app.spotifyNowPlayingEndpoint,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return {
    foo: 'bar',
  };
});

function getRequestHeaders(clientId: string, clientSecret: string) {
  const headers = new Headers();
  headers.set(
    'Authorization',
    'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
  );
  return headers;
}

function getRequestBody(refreshToken: string) {
  return new URLSearchParams({
    grant_type: 'client_credentials',
    refresh_token: refreshToken,
  });
}
