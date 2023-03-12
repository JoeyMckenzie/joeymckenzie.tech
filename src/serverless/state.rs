use derive_builder::Builder;
use reqwest::Client;

#[derive(Default, Builder, Debug)]
#[builder(setter(into))]
pub struct AppConfiguration {
    refresh_token: String,
    client_id: String,
    client_secret: String,
}

pub struct AppState {
    // spotify_client: SpotifyClient,
}

impl AppState {
    pub fn new(client: Client, configuration: AppConfiguration) -> AppState {
        Self {
            // spotify_client: 
        }
    }
}
