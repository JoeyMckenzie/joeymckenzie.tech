use std::{collections::HashMap, sync::Arc};

use axum::{extract::State, http::StatusCode, Json};
use reqwest::Client;
use tracing::{error, info};

use crate::{
    responses::NowPlayingResponse,
    spotify::{SpotifyAuthResponse, SpotifyNowPlayingResponse},
    state::AppState,
};

const TOKEN_ENDPOINT: &str = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT: &str = "https://api.spotify.com/v1/me/player?type=track,episode";

#[tracing::instrument]
pub async fn get_currently_listening_to(
    State(state): State<Arc<AppState>>,
) -> Result<Json<NowPlayingResponse>, StatusCode> {
    info!("received request for spotify currently listening to");

    let client = reqwest::Client::new();

    info!("retrieving access token from spotify");

    let access_token = get_access_token(
        &client,
        state.refresh_token.clone(),
        state.client_id.clone(),
        state.client_secret.clone(),
    )
    .await?;

    info!("successfully retrieved access token from spotify");
    info!("retrieving now playing from spotify");

    let now_playing = get_listening_to(client, access_token).await?;

    info!("currently listening to response: {:?}", now_playing);

    Ok(Json(now_playing))
}

#[tracing::instrument]
async fn get_access_token(
    client: &Client,
    refresh_token: String,
    client_id: String,
    client_secret: String,
) -> Result<String, StatusCode> {
    let refres_token = refresh_token.clone();
    let mut auth_params = HashMap::new();
    auth_params.insert("grant_type", "refresh_token");
    auth_params.insert("refresh_token", refres_token.as_str());

    let response = client
        .post(TOKEN_ENDPOINT)
        .basic_auth(client_id, Some(client_secret))
        .form(&auth_params)
        .send()
        .await
        .map_err(|e| {
            error!(
                "an error occurred while attempt to request an access token: {:?}",
                e
            );
            StatusCode::INTERNAL_SERVER_ERROR
        })?
        .json::<SpotifyAuthResponse>()
        .await
        .map_err(|e| {
            error!(
                "an error occurred while attempting deserialize access token response: {:?}",
                e
            );
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(response.access_token)
}

async fn get_listening_to(
    client: Client,
    access_token: String,
) -> Result<NowPlayingResponse, StatusCode> {
    let response = client
        .get(NOW_PLAYING_ENDPOINT)
        .bearer_auth(access_token)
        .send()
        .await
        .map_err(|e| {
            error!(
                "an error occurred while attempting to retrieve currently listening to: {:?}",
                e
            );
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if response.status() == StatusCode::NO_CONTENT {
        return Ok(NowPlayingResponse::default());
    }

    let now_playing_response = response
        .json::<SpotifyNowPlayingResponse>()
        .await
        .map_err(|e| {
            error!(
                "an error occurred while attempting to retrieve currently listening to: {:?}",
                e
            );
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    info!(
        "successfully retrieve spotify listening to response: {:?}",
        now_playing_response
    );

    Ok(now_playing_response.into())
}
