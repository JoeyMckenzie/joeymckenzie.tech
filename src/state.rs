use axum::extract::FromRef;
use leptos::LeptosOptions;
use sqlx::PgPool;

#[derive(FromRef, Clone, Debug)]
pub struct AppState {
    pub leptos_options: LeptosOptions,
    pub pool: PgPool,
}
