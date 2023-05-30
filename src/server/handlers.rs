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

pub async fn increment_view_count(
    Path(slug): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<(), AppServerError> {
    info!("received request to increment view count for slug {}", slug);
    state.repository.create_view_count(slug.clone()).await?;
    info!("view count incremented for slug {}", slug);
    Ok(())
}

pub async fn get_all_view_counts(
    State(state): State<Arc<AppState>>,
) -> Result<Json<ViewCountsResponse>, AppServerError> {
    info!("retrieving all view counts for blogs");
    let view_counts = state.repository.get_view_counts().await?;

    info!("view counts retrieved: {:?}", view_counts);
    let mapped_view_counts = view_counts
        .into_iter()
        .map(|vc| ViewCountResponse::new(vc.view_count, vc.slug))
        .collect();

    let response = ViewCountsResponse::new(mapped_view_counts);
    Ok(Json(response))
}

pub async fn get_view_count_for_slug(
    Path(slug): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<ViewCountResponse>, AppServerError> {
    info!("retrieving view count for slug {}", slug);
    let view_count = state.repository.get_view_count(slug).await?;
    Ok(Json(ViewCountResponse::new(
        view_count.view_count,
        view_count.slug,
    )))
}

pub async fn get_top_view_counts(
    State(state): State<Arc<AppState>>,
) -> Result<Json<ViewCountsResponse>, AppServerError> {
    info!("retrieving top view counts");
    let view_counts = state
        .repository
        .get_top_view_counts(state.settings.server.top_posts_threshold.into())
        .await?;

    info!("top view counts retrieved: {:?}", view_counts);
    let mapped_view_counts = view_counts
        .into_iter()
        .map(|vc| ViewCountResponse::new(vc.view_count, vc.slug))
        .collect();

    let response = ViewCountsResponse::new(mapped_view_counts);
    Ok(Json(response))
}
