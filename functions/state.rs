use std::{sync::Arc, time::Duration};

use shuttle_secrets::SecretStore;

#[derive(Debug)]
pub struct AppState {
    pub refresh_token: String,
    pub client_id: String,
    pub client_secret: String,
    pub timeout_duration_seconds: Duration,
}

impl AppState {
    pub fn new(
        refresh_token: String,
        client_id: String,
        client_secret: String,
        timeout_seconds: u64,
    ) -> Arc<Self> {
        Arc::new(Self {
            refresh_token,
            client_id,
            client_secret,
            timeout_duration_seconds: Duration::from_secs(timeout_seconds),
        })
    }
}

pub fn build_config(secret_store: SecretStore) -> Arc<AppState> {
    let refresh_token = secret_store
        .get("SPOTIFY_REFRESH_TOKEN")
        .expect("refresh token must be provided, please check the secrets file");
    let client_id = secret_store
        .get("SPOTIFY_CLIENT_ID")
        .expect("spotfiy client id must be provided, please check the secrets file");
    let client_secret = secret_store
        .get("SPOTIFY_CLIENT_SECRET")
        .expect("spotfiy client secret must be provided, please check the secrets file");
    let timeout_duration = secret_store
        .get("TIMEOUT_DURATION_SECONDS")
        .expect("timeout duration was not set")
        .parse::<u64>()
        .expect("timeout duration is not valid");

    AppState::new(refresh_token, client_id, client_secret, timeout_duration)
}
