use std::{sync::Arc, time::Duration};

use axum::{http::HeaderValue, routing::get, Router};
use hyper::{header, Method};
use reqwest::Client;
use tower_http::{cors::CorsLayer, timeout::TimeoutLayer};

use super::{handlers::get_currently_listening_to, spotify::client::SpotifyClient};

const SPOTIFY_REFRESH_TOKEN_KEY: &str = "SPOTIFY_REFRESH_TOKEN";
const SPOTIFY_CLIENT_ID_KEY: &str = "SPOTIFY_CLIENT_ID";
const SPOTIFY_CLIENT_SECRET_KEY: &str = "SPOTIFY_CLIENT_SECRET";

/// The expected UI dev/production ports. Note that shuttle does not support array-based secrets, so we'll define them as `const`s here for now.
const CORS_ORIGINS: [&str; 3] = [
    "http://localhost:3000",
    "https://joeymckenzie.tech",
    "https://www.joeymckenzie.tech",
];

// Constructs our API client based on the Spotify variables based on the runtime context.
pub fn build_spotify_client() -> Result<Arc<SpotifyClient>, Box<dyn std::error::Error>> {
    let refresh_token = std::env::var(SPOTIFY_REFRESH_TOKEN_KEY)?;
    let client_id = std::env::var(SPOTIFY_CLIENT_ID_KEY)?;
    let client_secret = std::env::var(SPOTIFY_CLIENT_SECRET_KEY)?;
    let client = Client::new();
    let spotify_client = SpotifyClient::new(client, refresh_token, client_id, client_secret);

    Ok(Arc::new(spotify_client))
}

/// Builds the axum router with an extension layer for our Spotify API client and various middlewares.
#[tracing::instrument]
pub fn build_router(timeout_duration_seconds: u64, spotify_client: Arc<SpotifyClient>) -> Router {
    let timeout_duration = Duration::from_secs(timeout_duration_seconds);

    let origins = CORS_ORIGINS
        .into_iter()
        .map(|o| o.parse::<HeaderValue>().unwrap())
        .collect::<Vec<HeaderValue>>();

    Router::new()
        .route("/spotify", get(get_currently_listening_to))
        .layer(TimeoutLayer::new(timeout_duration))
        .layer(
            CorsLayer::new()
                .allow_origin(origins)
                .allow_methods([Method::GET])
                .allow_headers([header::ACCEPT]),
        )
        .with_state(spotify_client)
}
