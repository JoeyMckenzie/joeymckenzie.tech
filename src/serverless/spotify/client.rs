use std::collections::HashMap;

use reqwest::{Client, StatusCode};
use tracing::info;

use crate::{errors::ShuttleServerError, spotify::api::SpotifyNowPlayingResponse};

use super::{api::SpotifyAuthResponse, responses::NowPlayingResponse};

const TOKEN_ENDPOINT: &str = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT: &str = "https://api.spotify.com/v1/me/player?type=track,episode";

#[derive(Debug)]
pub struct SpotifyClient {
    client: Client,
    refresh_token: String,
    client_id: String,
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

    #[tracing::instrument]
    pub async fn get_access_token(&self) -> Result<String, ShuttleServerError> {
        let mut auth_params = HashMap::new();
        auth_params.insert("grant_type", "refresh_token");
        auth_params.insert("refresh_token", &self.refresh_token);

        let response = self
            .client
            .post(TOKEN_ENDPOINT)
            .basic_auth(&self.client_id, Some(&self.client_secret))
            .form(&auth_params)
            .send()
            .await?
            .json::<SpotifyAuthResponse>()
            .await?;

        Ok(response.access_token)
    }

    pub async fn get_listening_to(
        &self,
        access_token: String,
    ) -> Result<NowPlayingResponse, ShuttleServerError> {
        let response = self
            .client
            .get(NOW_PLAYING_ENDPOINT)
            .bearer_auth(access_token)
            .send()
            .await?;

        if response.status() == StatusCode::NO_CONTENT {
            return Ok(NowPlayingResponse::default());
        }

        let now_playing_response = response.json::<SpotifyNowPlayingResponse>().await?;

        info!(
            "successfully retrieve spotify listening to response: {:?}",
            now_playing_response
        );

        Ok(now_playing_response.into())
    }
}
