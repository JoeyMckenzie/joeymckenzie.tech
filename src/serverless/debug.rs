mod errors;
mod handlers;
pub mod router;
mod spotify;

use std::env;

use errors::AppServerError;
use router::{build_router, build_spotify_client_from_env};
use tracing::info;

const PORT: u16 = 8080;

/// A runnable version of the serverless function that is deployed to [shuttle](https://shuttle.rs),
/// acting as an entry point to allow for ease of debugging and local development without needing
/// to spin up a local shuttle dev server.
#[tokio::main]
async fn main() -> Result<(), AppServerError> {
    // By default, all shuttle output utilizes tracing so we'll utilize standard output logging for dev runs
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();

    info!("Initializing spotify client...");

    let spotify_client = build_spotify_client_from_env();
    let timeout_duration_seconds = env::var("TIMEOUT_DURATION_SECONDS")
        .expect("timeout duration was not set")
        .parse::<u64>()
        .expect("timeout duration is not valid");

    info!("Spotify client initialized! Building router...");

    let router = build_router(timeout_duration_seconds, spotify_client);

    info!(
        "Router successfully initialized! Now serving on port {}",
        PORT
    );

    axum::Server::bind(&format!("0.0.0.0:{}", PORT).parse().unwrap())
        .serve(router.into_make_service())
        .await?;

    Ok(())
}
