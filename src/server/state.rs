use super::{
    settings::Settings, spotify::client::SpotifyClient, views::repository::ViewCountRepository,
};

#[derive(Debug)]
pub struct AppState {
    pub spotify_client: SpotifyClient,
    pub repository: ViewCountRepository,
    pub settings: Settings,
}

impl AppState {
    pub fn new(
        spotify_client: SpotifyClient,
        repository: ViewCountRepository,
        settings: Settings,
    ) -> Self {
        Self {
            spotify_client,
            repository,
            settings,
        }
    }
}
