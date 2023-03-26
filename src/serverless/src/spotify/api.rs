//! The following structures are the raw response types Spotify sends back. For simple purposes,
//! we're only consuming track/show information in the form of title and album image.

use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct SpotifyAuthResponse {
    pub access_token: String,
}

#[derive(Deserialize, Debug)]
pub struct SpotifyNowPlayingResponse {
    pub currently_playing_type: String,
    pub context: Context,
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
