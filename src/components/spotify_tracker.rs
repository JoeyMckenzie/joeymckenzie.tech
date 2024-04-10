use std::env;

use leptos::*;

use crate::{
    components::{spotify_not_playing::SpotifyNotPlaying, spotify_now_playing::SpotifyNowPlaying},
    spotify::{client::SpotifyClient, NowPlaying},
};

#[server(GetNotPlaying, "/spotify")]
pub async fn get_now_playing() -> Result<NowPlaying, ServerFnError> {
    dotenvy::dotenv()?;

    logging::log!("requesting now playing from spotify");

    let client = reqwest::Client::new();
    let refresh_token = env::var("SPOTIFY_REFRESH_TOKEN")?;
    let client_id = env::var("SPOTIFY_CLIENT_ID")?;
    let client_secret = env::var("SPOTIFY_CLIENT_SECRET")?;
    let client = SpotifyClient::new(client, refresh_token, client_id, client_secret);

    client
        .get_listening_to()
        .await
        .map_err(|e| ServerFnError::ServerError(e.to_string()))
}

#[component]
pub fn SpotifyTracker() -> impl IntoView {
    let response = create_resource(|| (), move |_| get_now_playing());

    view! {
        <Suspense fallback=move || {
            view! { <SpotifyNotPlaying/> }
        }>
            {move || match response.get() {
                Some(now_playing_result) => {
                    match now_playing_result {
                        Ok(now_playing) => {
                            if now_playing.now_playing {
                                view! { <SpotifyNowPlaying now_playing=now_playing/> }
                            } else {
                                view! { <SpotifyNotPlaying/> }
                            }
                        }
                        Err(_) => {
                            view! { <SpotifyNotPlaying/> }
                        }
                    }
                }
                None => {
                    view! { <SpotifyNotPlaying/> }
                }
            }}

        </Suspense>
    }
}
