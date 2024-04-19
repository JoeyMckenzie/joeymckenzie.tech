use std::env;

use axum::extract::FromRef;
use leptos::LeptosOptions;
use sqlx::PgPool;

use crate::{db::PostRepository, spotify::client::SpotifyClient};

#[derive(FromRef, Clone, Debug)]
pub struct AppState {
    pub leptos_options: LeptosOptions,
    pub pool: PgPool,
    pub spotify_client: SpotifyClient,
}

impl AppState {
    pub async fn try_from_leptos_state(leptos_options: LeptosOptions) -> anyhow::Result<Self> {
        let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;
        let repository = PostRepository::new(pool.clone());
        let client = reqwest::Client::new();
        let refresh_token = env::var("SPOTIFY_REFRESH_TOKEN")?;
        let client_id = env::var("SPOTIFY_CLIENT_ID")?;
        let client_secret = env::var("SPOTIFY_CLIENT_SECRET")?;
        let client = SpotifyClient::new(client, refresh_token, client_id, client_secret);

        Ok(Self {
            leptos_options,
            pool,
            spotify_client: client,
        })
    }
}
