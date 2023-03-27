use std::sync::Arc;

use axum::{extract::State, Json};
use tracing::info;

use super::{
    errors::AppServerError,
    spotify::{client::SpotifyClient, responses::NowPlayingResponse},
};

/// An endpoint for retrieving our current listening state.
/// When calling the Spotify API, it's important to note
/// that if there is no song or podcast playing on a device
/// logged
pub async fn get_currently_listening_to(
    State(spotify_client): State<Arc<SpotifyClient>>,
) -> Result<Json<NowPlayingResponse>, AppServerError> {
    info!(
        "Received request for spotify currently listening to, retrieving access token from spotify..."
    );
    let access_token = spotify_client.get_access_token().await?;

    info!("Successfully retrieved access token from spotify, request now playing...");
    let now_playing = spotify_client.get_listening_to(access_token).await?;

    info!("Currently listening to response: {:?}", now_playing);
    Ok(Json(now_playing))
}
