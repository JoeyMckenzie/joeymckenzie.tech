mod server;

use std::net::SocketAddr;

use tracing::info;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

use server::router::{build_router, build_spotify_client};

/// The shuttle entry point injected with our secrets store at dev/runtime with secrets from `Secrets.toml`. Don't check that file in!
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv()?;

    let log_level = std::env::var("LOG_LEVEL")?;

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(log_level))
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("initializing application, loading environment");

    let timeout_duration_seconds = std::env::var("TIMEOUT_DURATION_SECONDS")?.parse::<u64>()?;
    let port = std::env::var("PORT")?.parse::<u16>()?;

    info!("environment loaded, building spotify client and router");

    let spotify_client = build_spotify_client()?;
    let router = build_router(timeout_duration_seconds, spotify_client);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    info!(
        "router successfully initialized, now listening on port {}",
        port
    );

    axum::Server::bind(&addr)
        .serve(router.into_make_service())
        .await?;

    Ok(())
}
