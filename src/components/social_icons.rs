use leptos::*;
use leptos_router::*;

use crate::components::DisplayableIcon;

#[component]
pub fn SocialIcons() -> impl IntoView {
    let socials = create_rw_signal(vec![
        DisplayableIcon {
            href: "https://twitter.com/_joeyMcKenzie",
            display: "Twitter",
            icon: Some("icon-[mdi--twitter]"),
        },
        DisplayableIcon {
            href: "https://github.com/JoeyMcKenzie",
            display: "GitHub",
            icon: Some("icon-[mdi--github]"),
        },
        DisplayableIcon {
            href: "https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#",
            display: "YouTube",
            icon: Some("icon-[mdi--youtube]"),
        },
        DisplayableIcon {
            href: "https://twitch.tv/JoeTheDevMan",
            display: "Twitch",
            icon: Some("icon-[mdi--twitch]"),
        },
        DisplayableIcon {
            href: "https://linkedin.com/in/JoeyMcKenzie",
            display: "LinkedIn",
            icon: Some("icon-[mdi--linkedin]"),
        },
    ]);

    view! {
        <div class="flex items-center justify-center space-x-4">
            <For each=socials key=|social| social.display let:social>
                <A href=social.href class="flex my-auto hover:underline">
                    <span class="sr-only">{social.display}</span>
                    <span class=format!(
                        "h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 {}",
                        social.icon.unwrap(),
                    )></span>
                </A>
            </For>
        </div>
    }
}
