use super::{spotify::client::SpotifyClient, views::repository::ViewCountRepository};

#[derive(Debug)]
pub struct AppState {
    pub spotify_client: SpotifyClient,
    pub repository: ViewCountRepository,
}

impl AppState {
    pub fn new(spotify_client: SpotifyClient, repository: ViewCountRepository) -> Self {
        Self {
            spotify_client,
            repository,
        }
    }
}
