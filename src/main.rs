mod server;

use std::{net::SocketAddr, sync::Arc};

use anyhow::Context;
use sqlx::postgres::PgPoolOptions;
use tracing::info;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

use server::router::{build_router, build_spotify_client};

use crate::server::{state::AppState, views::repository::ViewCountRepository};

/// The shuttle entry point injected with our secrets store at dev/runtime with secrets from `Secrets.toml`. Don't check that file in!
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().context("environment variables not read from file, check your .env file")?;

    let log_level = std::env::var("LOG_LEVEL").context("log level environment variable not set")?;

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(log_level))
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("initializing application, loading environment");

    let timeout_duration_seconds = std::env::var("TIMEOUT_DURATION_SECONDS")
        .context("timeout duration environment variable not found")?
        .parse::<u64>()
        .context("timeout duration unable to be parsed")?;
    let port = std::env::var("PORT")
        .context("port environment variable not found")?
        .parse::<u16>()
        .context("port unable to be parsed")?;
    let max_connections = std::env::var("MAX_DB_CONNECTIONS")
        .context("max database connections environment variable not found")?
        .parse::<u32>()
        .context("max database connections unable to be parsed")?;
    let connection_string = std::env::var("DATABASE_URL")
        .context("connection string environment variable not found")?;

    info!("environment loaded, initializing connection pool to neon");

    let pool = PgPoolOptions::new()
        .max_connections(max_connections)
        .connect(&connection_string)
        .await
        .context("connection pool to neon was not established")?;

    let view_count_repository = ViewCountRepository::new(pool);

    info!("connection pool successfully initialized, building spotify client");

    let spotify_client = build_spotify_client()?;
    let app_state = AppState::new(spotify_client, view_count_repository);
    let router = build_router(timeout_duration_seconds, Arc::new(app_state));
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
