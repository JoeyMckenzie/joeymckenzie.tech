// TODO: One of these I'm gonna figure out how to use the Spotify TS SDK, though that day is not today...

type AccessTokenResponse = {
  access_token: string;
  token_type: string;
};

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const { access_token: accessToken, token_type: tokenType } =
    await $fetch<AccessTokenResponse>(config.app.spotifyTokenEndpoint, {
      method: 'POST',
      headers: getRequestHeaders(
        config.app.spotifyClientId,
        config.app.spotifyClientSecret,
      ),
      body: getRequestBody(config.app.spotifyRefreshToken),
    });

  const nowPlayingResponse = await $fetch(
    config.app.spotifyNowPlayingEndpoint,
    {
      method: 'GET',
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    },
  );

  console.log(nowPlayingResponse);

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
