use std::collections::HashMap;

use leptos::tracing::info;
use reqwest::{Client, StatusCode};

use crate::spotify::{
    responses::{SpotifyAuthResponse, SpotifyNowPlayingResponse},
    NowPlaying,
};

const TOKEN_ENDPOINT: &str = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT: &str = "https://api.spotify.com/v1/me/player?type=track,episode";

/// An API client accessible to all serverless routes allowing us to encapsulate all API interaction with Spotify.
#[derive(Debug)]
pub struct SpotifyClient {
    /// Reqwest HTTP client, provided at startup.
    client: Client,
    /// Spotify refresh token provided from Spotify.
    refresh_token: String,
    /// Spotify app client ID, referenced from their portal.
    client_id: String,
    /// Spotify app client secret, referenced from their portal.
    client_secret: String,
}

impl SpotifyClient {
    pub fn new(
        client: Client,
        refresh_token: String,
        client_id: String,
        client_secret: String,
    ) -> Self {
        Self {
            client,
            refresh_token,
            client_id,
            client_secret,
        }
    }

    /// Retrieves an access token to use for calling Spotify APIs that require authentication.
    /// To retrive an access token, we send a basic authentication header along with the
    /// grant type and refresh token on the request, and in turn receive an access token.
    pub async fn get_access_token(&self) -> anyhow::Result<String> {
        info!("building authentication request for spotify");

        let mut auth_params = HashMap::new();
        auth_params.insert("grant_type", "refresh_token");
        auth_params.insert("refresh_token", &self.refresh_token);

        info!("requesting access token from spotify");

        let response = self
            .client
            .post(TOKEN_ENDPOINT)
            .basic_auth(&self.client_id, Some(&self.client_secret))
            .form(&auth_params)
            .send()
            .await?
            .json::<SpotifyAuthResponse>()
            .await?;

        info!("access token successfully retrieved");

        Ok(response.access_token)
    }

    /// Retrieves the current track or podcast we're listening to at the moment, marshaling
    /// the raw API responses from Spotify into a simple format to consume on the frontend.
    pub async fn get_listening_to(&self, access_token: String) -> anyhow::Result<NowPlaying> {
        info!("requesting now playing information from spotify");

        let response = self
            .client
            .get(NOW_PLAYING_ENDPOINT)
            .bearer_auth(access_token)
            .send()
            .await?;
        let status = response.status();

        info!(
            "now playing successfully retrieved with status: {:?}",
            status
        );

        // In the case we get a 204 back from Spotify, assume we're not currently listening to anything
        if status == StatusCode::NO_CONTENT {
            info!("no content currently playing");
            return Ok(NowPlaying::default());
        }

        info!("currently playing content identified");

        let now_playing_response = response.json::<SpotifyNowPlayingResponse>().await?;

        info!(
            "successfully retrieve spotify listening to response: {:?}",
            now_playing_response
        );

        Ok(now_playing_response.into())
    }
}
