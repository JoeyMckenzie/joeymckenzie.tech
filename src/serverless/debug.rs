mod errors;
mod handlers;
pub mod router;
mod spotify;

use std::env;

use errors::ShuttleServerError;
use router::{build_router, build_spotify_client_from_env};
use tracing::info;

const PORT: u16 = 8080;

#[tokio::main]
async fn main() -> Result<(), ShuttleServerError> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();

    info!("initializing spotify client");

    let spotify_client = build_spotify_client_from_env();
    let timeout_duration_seconds = env::var("TIMEOUT_DURATION_SECONDS")
        .expect("timeout duration was not set")
        .parse::<u64>()
        .expect("timeout duration is not valid");

    info!("spotify client initialized, building router");

    let router = build_router(timeout_duration_seconds, spotify_client);

    info!(
        "router successfully initialized, now serving on port {}",
        PORT
    );

    axum::Server::bind(&format!("0.0.0.0:{}", PORT).parse().unwrap())
        .serve(router.into_make_service())
        .await?;

    Ok(())
}
