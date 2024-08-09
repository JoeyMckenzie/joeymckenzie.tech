use leptos::*;

use crate::components::{
    powered_by::PoweredBy, social_icons::SocialIcons, spotify_tracker::SpotifyTracker,
};

#[component]
pub fn Footer() -> impl IntoView {
    view! {
        <div class="flex flex-col items-center w-full p-12 mx-auto mt-auto max-w-screen-4xl justify-evenly gap-y-8 sm:flex-row sm:items-end">
            <SocialIcons />
            <SpotifyTracker />
            <PoweredBy />
        </div>
    }
}
