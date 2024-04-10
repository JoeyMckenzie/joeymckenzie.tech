use std::env;

use leptos::*;
use tracing::info;

use crate::{
    components::{spotify_not_playing::SpotifyNotPlaying, spotify_now_playing::SpotifyNowPlaying},
    spotify::{client::SpotifyClient, NowPlaying},
};

#[server(GetNotPlaying, "/spotify")]
pub async fn get_now_playing() -> Result<NowPlaying, ServerFnError> {
    dotenvy::dotenv()?;

    info!("requesting spotify");

    let client = reqwest::Client::new();
    let refresh_token = env::var("SPOTIFY_REFRESH_TOKEN")?;
    let client_id = env::var("SPOTIFY_CLIENT_ID")?;
    let client_secret = env::var("SPOTIFY_CLIENT_SECRET")?;

    let client = SpotifyClient::new(client, refresh_token, client_id, client_secret);
    let token = client.get_access_token().await.unwrap();

    Ok(client.get_listening_to(token).await.unwrap())
}

#[component]
pub fn SpotifyTracker(children: Children) -> impl IntoView {
    let response = create_server_action::<GetNotPlaying>();

    match response.value().get() {
        Some(now_playing_result) => match now_playing_result {
            Ok(now_playing) => {
                view! { <SpotifyNowPlaying now_playing=now_playing>{children()}</SpotifyNowPlaying> }
            }
            Err(_) => view! { <SpotifyNotPlaying>{children()}</SpotifyNotPlaying> },
        },
        None => view! { <SpotifyNotPlaying>{children()}</SpotifyNotPlaying> },
    }
}
