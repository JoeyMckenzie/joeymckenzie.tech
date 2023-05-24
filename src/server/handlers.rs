use std::sync::Arc;

use axum::{
    extract::{Path, State},
    Json,
};
use tracing::info;

use super::{
    errors::AppServerError,
    spotify::responses::NowPlayingResponse,
    state::AppState,
    views::responses::{ViewCountResponse, ViewCountsResponse},
};

/// An endpoint for retrieving our current listening state.
/// When calling the Spotify API, it's important to note
/// that if there is no song or podcast playing on a device
/// logged
pub async fn get_currently_listening_to(
    State(state): State<Arc<AppState>>,
) -> Result<Json<NowPlayingResponse>, AppServerError> {
    info!(
        "received request for spotify currently listening to, retrieving access token from spotify..."
    );
    let access_token = state.spotify_client.get_access_token().await?;

    info!("successfully retrieved access token from spotify, request now playing...");
    let now_playing = state.spotify_client.get_listening_to(access_token).await?;

    info!("currently listening to response: {:?}", now_playing);
    Ok(Json(now_playing))
}

/// An endpoint for updating the view count for blogs.
/// We'll lazily upsert the view count based on the slug.
pub async fn increment_view_count(
    Path(slug): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<(), AppServerError> {
    Ok(())
}

/// An endpoint for retrieving all view counts from neon.
pub async fn get_all_view_counts(
    Path(slug): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<ViewCountsResponse, AppServerError> {
    Ok(ViewCountsResponse::new(Vec::<ViewCountResponse>::new()))
}

pub async fn get_view_count_for_slug(
    Path(slug): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<ViewCountResponse, AppServerError> {
    Ok(ViewCountResponse::new(
        420_u32,
        "how-to-be-awesome".to_string(),
    ))
}
