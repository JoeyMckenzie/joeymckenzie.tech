use std::sync::Arc;

use axum::{Extension, Json};
use tracing::info;

use crate::{
    errors::ShuttleServerError,
    spotify::{client::SpotifyClient, responses::NowPlayingResponse},
};

/// An endpoint for retrieving our current listening state.
/// When calling the Spotify API, it's important to note
/// that if there is no song or podcast playing on a device
/// logged
pub async fn get_currently_listening_to(
    Extension(spotify_client): Extension<Arc<SpotifyClient>>,
) -> Result<Json<NowPlayingResponse>, ShuttleServerError> {
    info!(
        "Received request for spotify currently listening to, retrieving access token from spotify..."
    );
    let access_token = spotify_client.get_access_token().await?;

    info!("Successfully retrieved access token from spotify, request now playing...");
    let now_playing = spotify_client.get_listening_to(access_token).await?;

    info!("Currently listening to response: {:?}", now_playing);
    Ok(Json(now_playing))
}
