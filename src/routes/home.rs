use leptos::*;

use crate::components::{intro::Intro, social_buttons::SocialButtons};

#[component]
pub fn HomePage() -> impl IntoView {
    view! {
        <Intro />
        <SocialButtons />
    }
}
