use std::env;
use std::net::SocketAddr;
use std::sync::Arc;

use axum::Router;
use sqlx::{PgPool, Pool, Postgres};
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::api::posts::new_posts_router;

mod api;
mod errors;

pub struct AppState {
    pool: Pool<Postgres>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv()?;

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "server=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("environment initialized, building router");

    let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;
    let state = Arc::new(AppState { pool });
    let app = Router::new()
        .nest_service("/", ServeFile::new("dist/index.html"))
        .nest_service("/assets", ServeDir::new("dist/assets"))
        .nest("/api/posts", new_posts_router(state.clone()));

    let port = env::var("PORT")?.parse::<u16>()?;
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr).await?;

    info!("listening on {}", listener.local_addr()?);

    axum::serve(listener, app.layer(TraceLayer::new_for_http())).await?;

    Ok(())
}
