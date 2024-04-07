use leptos::*;
use leptos_router::*;

#[derive(Clone, Debug)]
struct SocialIcon {
    href: String,
    display: String,
    icon: String,
}

#[component]
pub fn SocialIcons() -> impl IntoView {
    let socials = create_rw_signal(vec![
        SocialIcon {
            href: "https://twitter.com/_joeyMcKenzie".to_string(),
            display: "Twitter".to_string(),
            icon: "icon-[mdi--twitter]".to_string(),
        },
        SocialIcon {
            href: "https://github.com/JoeyMcKenzie".to_string(),
            display: "GitHub".to_string(),
            icon: "icon-[mdi--github]".to_string(),
        },
        SocialIcon {
            href: "https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#".to_string(),
            display: "YouTube".to_string(),
            icon: "icon-[mdi--youtube]".to_string(),
        },
        SocialIcon {
            href: "https://twitch.tv/JoeTheDevMan".to_string(),
            display: "Twitch".to_string(),
            icon: "icon-[mdi--twitch]".to_string(),
        },
        SocialIcon {
            href: "https://linkedin.com/in/JoeyMcKenzie".to_string(),
            display: "LinkedIn".to_string(),
            icon: "icon-[mdi--linkedin]".to_string(),
        },
    ]);

    view! {
        <div class="flex justify-center space-x-4">
            <For
                each=socials
                key=|social| social.display.clone()
                let:social
            >
                <A href=social.href class="hover:underline">
                    <span class="sr-only">{social.display}</span>
                    <span class=format!("h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 {}", social.icon) />
                </A>
            </For>
        </div>
    }
}
