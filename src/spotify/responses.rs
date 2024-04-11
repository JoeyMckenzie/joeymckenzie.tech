use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct SpotifyAuthResponse {
    pub access_token: String,
}

#[derive(Deserialize, Debug)]
pub struct SpotifyNowPlayingResponse {
    pub currently_playing_type: String,
    pub context: Option<Context>,
    pub item: Item,
}

#[derive(Deserialize, Debug)]
pub struct Context {
    pub external_urls: ContextUrls,
}

#[derive(Deserialize, Debug)]
pub struct ContextUrls {
    pub spotify: String,
}

#[derive(Deserialize, Debug)]
pub struct Item {
    /// The title track
    pub name: String,
    pub album: Option<Album>,
    pub show: Option<Show>,
    pub artists: Option<Vec<Artist>>,
    pub external_urls: Option<ContextUrls>,
}

#[derive(Deserialize, Debug)]
pub struct Artist {
    pub name: String,
}

#[derive(Deserialize, Debug)]
pub struct Album {
    /// The title track
    pub name: String,
    pub images: Vec<Image>,
}

#[derive(Deserialize, Debug)]
pub struct Show {
    /// The title track
    pub name: String,
    pub images: Vec<Image>,
}

#[derive(Deserialize, Debug)]
pub struct Image {
    pub url: String,
}
