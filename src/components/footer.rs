use leptos::*;

use crate::components::{powered_by::PoweredBy, social_icons::SocialIcons};

#[component]
pub fn Footer() -> impl IntoView {
    view! {
        <div class="max-w-screen-4xl mx-auto mt-auto flex w-full flex-col items-center justify-evenly gap-y-8 p-12 sm:flex-row sm:items-end">
            <SocialIcons/>
            // <SpotifyTracker>
            // <Icon class="h-6 w-6 text-green-500" icon="logos:spotify-icon" />
            // </SpotifyTracker>
            <PoweredBy/>
        </div>
    }
}
