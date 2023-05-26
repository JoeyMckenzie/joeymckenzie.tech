use std::{sync::Arc, time::Duration};

use anyhow::Context;
use axum::{
    http::HeaderValue,
    routing::{get, post},
    Router,
};
use hyper::{header, Method};
use reqwest::Client;
use tower_http::{cors::CorsLayer, timeout::TimeoutLayer};

use super::{
    handlers::{get_currently_listening_to, increment_view_count},
    spotify::client::SpotifyClient,
    state::AppState,
};

// Constructs our API client based on the Spotify variables based on the runtime context.
pub fn build_spotify_client() -> anyhow::Result<SpotifyClient> {
    let refresh_token = std::env::var("SPOTIFY_REFRESH_TOKEN")
        .context("spotify refresh token environment variable not found")?;
    let client_id = std::env::var("SPOTIFY_CLIENT_ID")
        .context("spotify client ID environment variable not found")?;
    let client_secret = std::env::var("SPOTIFY_CLIENT_SECRET")
        .context("spotify client secret environment variable not found")?;
    let client = Client::new();
    let spotify_client = SpotifyClient::new(client, refresh_token, client_id, client_secret);

    Ok(spotify_client)
}

/// Builds the axum router with an extension layer for our Spotify API client and various middlewares.
#[tracing::instrument]
pub fn build_router(timeout_duration_seconds: u64, app_state: Arc<AppState>) -> Router {
    let timeout_duration = Duration::from_secs(timeout_duration_seconds);

    let origins = app_state
        .as_ref()
        .settings
        .server
        .cors_origins
        .clone()
        .into_iter()
        .map(|o| o.parse::<HeaderValue>().unwrap())
        .collect::<Vec<HeaderValue>>();

    Router::new()
        .route("/spotify", get(get_currently_listening_to))
        .route("/views/:slug", post(increment_view_count))
        .route("/views/:slug", get(increment_view_count))
        .layer(TimeoutLayer::new(timeout_duration))
        .layer(
            CorsLayer::new()
                .allow_origin(origins)
                .allow_methods([Method::GET, Method::POST])
                .allow_headers([header::ACCEPT]),
        )
        .with_state(app_state)
}
