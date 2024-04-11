use leptos::*;
use leptos_router::*;

use crate::components::DisplayableIcon;

#[component]
pub fn SocialButtons() -> impl IntoView {
    let socials = create_rw_signal(vec![
        DisplayableIcon {
            href: "https://github.com/joeymckenzie",
            display: "GitHub",
            icon: Some("icon-[simple-icons--github]"),
        },
        DisplayableIcon {
            href: "https://linkedin.com/in/joeymckenzie",
            display: "LinkedIn",
            icon: Some("icon-[mdi--linkedin]"),
        },
        DisplayableIcon {
            href: "https://twitter.com/_joeyMcKenzie",
            display: "Twitter",
            icon: Some("icon-[pajamas--twitter]"),
        },
    ]);

    view! {
        <div class="flex justify-center mx-auto grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 py-8 sm:grid-cols-3">
            <For each=socials key=|social| social.display let:social>
                <A href=social.href class="btn">
                    <span class=format!("w-5 h-5 {}", social.icon.unwrap())></span>
                    {social.display}
                    <span class="w-5 h-5 icon-[gridicons--external]"></span>
                </A>
            </For>
        </div>
    }
}
