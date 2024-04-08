use leptos::*;

use crate::{
    components::{spotify_not_playing::SpotifyNotPlaying, spotify_now_playing::SpotifyNowPlaying},
    spotify::{
        responses::{Context, ContextUrls, Item, SpotifyNowPlayingResponse},
        SpotifyTracking,
    },
};

#[component]
pub fn SpotifyTracker(children: Children) -> impl IntoView {
    let (response, _) = create_signal(SpotifyTracking::default());

    view! {
        <Show when=move || { response.get().now_playing }>
            // <SpotifyNowPlaying now_playing=response>{children()}</SpotifyNowPlaying>
            <div>"asdf"</div>
        </Show>
    }
}
