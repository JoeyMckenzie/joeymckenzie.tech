use leptos::*;

use crate::{components::spotify_now_playing::SpotifyNowPlaying, spotify::SpotifyTracking};

#[component]
pub fn SpotifyTracker(children: Children) -> impl IntoView {
    let (response, _) = create_signal(SpotifyTracking::default());

    view! {
        <Show when=move || { response.get().now_playing }>
            <SpotifyNowPlaying now_playing=response/>
        </Show>
    }
}
