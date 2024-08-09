use std::env;

use leptos::*;

use crate::{
    components::{spotify_not_playing::SpotifyNotPlaying, spotify_now_playing::SpotifyNowPlaying},
    spotify::NowPlaying,
};

#[server(GetNotPlaying, "/spotify")]
pub async fn get_now_playing() -> Result<NowPlaying, ServerFnError> {
    use crate::state::AppState;

    let state = expect_context::<AppState>();

    state
        .spotify_client
        .get_listening_to()
        .await
        .map_err(|e| ServerFnError::ServerError(e.to_string()))
}

#[component]
pub fn SpotifyTracker() -> impl IntoView {
    let response = create_resource(|| (), move |_| get_now_playing());

    view! {
        <Suspense fallback=move || {
            view! { <SpotifyNotPlaying loading=true /> }
        }>
            {move || match response.get() {
                Some(now_playing_result) => {
                    match now_playing_result {
                        Ok(now_playing) => {
                            if now_playing.now_playing {
                                view! { <SpotifyNowPlaying now_playing=now_playing /> }
                            } else {
                                view! { <SpotifyNotPlaying /> }
                            }
                        }
                        Err(_) => {
                            view! { <SpotifyNotPlaying /> }
                        }
                    }
                }
                None => {
                    view! { <SpotifyNotPlaying /> }
                }
            }}

        </Suspense>
    }
}
