use std::sync::Arc;

use axum::{Extension, Json};
use tracing::info;

use crate::{
    errors::ShuttleServerError,
    spotify::{client::SpotifyClient, responses::NowPlayingResponse},
};

pub async fn get_currently_listening_to(
    Extension(spotify_client): Extension<Arc<SpotifyClient>>,
) -> Result<Json<NowPlayingResponse>, ShuttleServerError> {
    info!(
        "received request for spotify currently listening to, retrieving access token from spotify"
    );

    let access_token = spotify_client.get_access_token().await?;

    info!("successfully retrieved access token from spotify, request now playing");

    let now_playing = spotify_client.get_listening_to(access_token).await?;

    info!("currently listening to response: {:?}", now_playing);

    Ok(Json(now_playing))
}
