use leptos::*;
use leptos_router::A;

use crate::components::DisplayableIcon;

#[component]
pub fn PoweredBy() -> impl IntoView {
    let socials = create_rw_signal(vec![
        DisplayableIcon {
            href: "https://www.rust-lang.org/",
            display: "GitHub",
            icon: Some("icon-[simple-icons--rust]"),
        },
        DisplayableIcon {
            href: "https://leptos.dev",
            display: "Leptos",
            icon: Some("icon-[simple-icons--leptos]"),
        },
        DisplayableIcon {
            href: "https://fly.io",
            display: "Twitter",
            icon: Some("icon-[logos--fly-icon]"),
        },
    ]);

    view! {
        <div class="flex justify-center space-x-4">
            <For each=socials key=|social| social.display let:social>
                <A href=social.href class="hover:underline">
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
