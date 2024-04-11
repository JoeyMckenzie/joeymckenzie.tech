use leptos::*;

use crate::components::{
    powered_by::PoweredBy, social_icons::SocialIcons, spotify_tracker::SpotifyTracker,
};

#[component]
pub fn Footer() -> impl IntoView {
    view! {
        <div class="max-w-screen-4xl mx-auto mt-auto flex w-full flex-col items-center justify-evenly gap-y-8 p-12 sm:flex-row sm:items-end">
            <SocialIcons/>
            <SpotifyTracker/>
            <PoweredBy/>
        </div>
    }
}
