use std::{env, sync::Arc, time::Duration};

use axum::{http::HeaderValue, routing::get, Extension, Router};
use hyper::{header, Method};
use reqwest::Client;
use shuttle_secrets::SecretStore;
use tower_http::{cors::CorsLayer, timeout::TimeoutLayer};

use crate::{handlers::get_currently_listening_to, spotify::client::SpotifyClient};

/// The expected UI dev/production ports. Note that shuttle does not support array-based secrets, so we'll define them as `const`s here for now.
pub const CORS_ORIGINS: [&str; 3] = [
    "http://localhost:3000",
    "https://joeymckenzie.tech",
    "https://www.joeymckenzie.tech",
];

/// Builds a Spotify API client based on the shuttle secrets set at runtime.
pub fn build_spotify_client_from_shuttle_secrets(secret_store: &SecretStore) -> Arc<SpotifyClient> {
    let refresh_token = secret_store
        .get("SPOTIFY_REFRESH_TOKEN")
        .expect("refresh token must be provided, please check the secrets file");
    let client_id = secret_store
        .get("SPOTIFY_CLIENT_ID")
        .expect("spotfiy client id must be provided, please check the secrets file");
    let client_secret = secret_store
        .get("SPOTIFY_CLIENT_SECRET")
        .expect("spotfiy client secret must be provided, please check the secrets file");

    build_spotify_client(refresh_token, client_id, client_secret)
}

/// Builds a Spotify API client based on local environments, used primarily for the debug runner in `debug.rs`.
pub fn build_spotify_client_from_env() -> Arc<SpotifyClient> {
    dotenv::dotenv().ok();

    let refresh_token = env::var("SPOTIFY_REFRESH_TOKEN")
        .expect("refresh token must be provided, please check the secrets file");
    let client_id = env::var("SPOTIFY_CLIENT_ID")
        .expect("spotfiy client id must be provided, please check the secrets file");
    let client_secret = env::var("SPOTIFY_CLIENT_SECRET")
        .expect("spotfiy client secret must be provided, please check the secrets file");

    build_spotify_client(refresh_token, client_id, client_secret)
}

// Constructs our API client based on the Spotify variables based on the runtime context.
fn build_spotify_client(
    refresh_token: String,
    client_id: String,
    client_secret: String,
) -> Arc<SpotifyClient> {
    let client = Client::new();
    let spotify_client = SpotifyClient::new(client, refresh_token, client_id, client_secret);

    Arc::new(spotify_client)
}

/// Builds the axum router with an extension layer for our Spotify API client and various middlewares.
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
        .layer(Extension(spotify_client))
}
