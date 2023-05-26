mod server;

use std::{net::SocketAddr, sync::Arc};

use anyhow::Context;
use sqlx::postgres::PgPoolOptions;
use tracing::info;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

use server::router::{build_router, build_spotify_client};

use crate::server::{settings::Settings, state::AppState, views::repository::ViewCountRepository};

/// The shuttle entry point injected with our secrets store at dev/runtime with secrets from `Secrets.toml`. Don't check that file in!
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().context("environment variables not read from file, check your .env file")?;

    let settings = Settings::new().context("configuration was not able to load")?;

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            settings.log_level.clone(),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let connection_string = std::env::var("DATABASE_URL")
        .context("connection string environment variable not found")?;

    info!("environment loaded, initializing connection pool to neon");

    let pool = PgPoolOptions::new()
        .max_connections(settings.database.max_db_connections.into())
        .connect(&connection_string)
        .await
        .context("connection pool to neon was not established")?;

    info!("connection pool successfully initialized, running migrations");

    sqlx::migrate!()
        .run(&pool)
        .await
        .context("error while running migrations")?;
    let view_count_repository = ViewCountRepository::new(pool);

    info!("migrations successfully run, building router");

    let port = settings.server.port;
    let timeout_duration = settings.server.timeout_duration_seconds;
    let spotify_client = build_spotify_client()?;
    let app_state = AppState::new(spotify_client, view_count_repository, settings);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let router = build_router(timeout_duration.into(), Arc::new(app_state));

    info!(
        "router successfully initialized, now listening on port {}",
        port
    );

    axum::Server::bind(&addr)
        .serve(router.into_make_service())
        .await?;

    Ok(())
}
