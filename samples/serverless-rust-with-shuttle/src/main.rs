mod errors;
mod handlers;
mod state;

use axum::{routing::get, Router};
use handlers::get_repository_stars;
use shuttle_secrets::SecretStore;
use state::HandlerState;

#[shuttle_runtime::main]
async fn axum(#[shuttle_secrets::Secrets] secret_store: SecretStore) -> shuttle_axum::ShuttleAxum {
    tracing::info!("Bootstrapping function secrests");

    let token = secret_store
        .get("GITHUB_ACCESS_TOKEN")
        .expect("No access token was provided.");

    tracing::info!("Secrets successfully read, building server router");

    let router = Router::new()
        .route("/:repository/stars", get(get_repository_stars))
        .with_state(HandlerState::new_state(token));

    tracing::info!("Router successfully initialized, now listening on port 8000");

    Ok(router.into())
}
