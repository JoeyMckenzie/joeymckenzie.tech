mod serverless;

use serverless::router::{build_router, build_spotify_client_from_shuttle_secrets};
use shuttle_secrets::SecretStore;

/// The shuttle entry point injected with our secrets store at dev/runtime with secrets from `Secrets.toml`. Don't check that file in!
#[shuttle_runtime::main]
async fn spotify(
    #[shuttle_secrets::Secrets] secret_store: SecretStore,
) -> shuttle_axum::ShuttleAxum {
    let spotify_client = build_spotify_client_from_shuttle_secrets(&secret_store);
    let timeout_duration_seconds = secret_store
        .get("TIMEOUT_DURATION_SECONDS")
        .expect("timeout duration was not set")
        .parse::<u64>()
        .expect("timeout duration is not valid");

    let router = build_router(timeout_duration_seconds, spotify_client);

    Ok(router.into())
}
