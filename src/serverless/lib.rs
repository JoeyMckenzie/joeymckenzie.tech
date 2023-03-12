mod errors;
mod handlers;
pub mod router;
mod spotify;
mod state;

use router::{build_router, build_spotify_client_from_shuttle_secrets};
use shuttle_secrets::SecretStore;

use sync_wrapper::SyncWrapper;

/// The shuttle entry point injected with our secrets store at dev/runtime with secrets from `Secrets.toml`. Don't check that file in!
#[shuttle_service::main]
async fn spotify(
    #[shuttle_secrets::Secrets] secret_store: SecretStore,
) -> shuttle_service::ShuttleAxum {
    let spotify_client = build_spotify_client_from_shuttle_secrets(&secret_store);
    let timeout_duration_seconds = secret_store
        .get("TIMEOUT_DURATION_SECONDS")
        .expect("timeout duration was not set")
        .parse::<u64>()
        .expect("timeout duration is not valid");

    let router = build_router(timeout_duration_seconds, spotify_client);
    let sync_wrapper = SyncWrapper::new(router);

    Ok(sync_wrapper)
}
