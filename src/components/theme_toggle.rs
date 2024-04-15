use gloo_storage::Storage;
use leptos::*;
use leptos_meta::*;

const THEME_KEY: &str = "joeymckenzie.tech-theme";
const DARK_THEME: &str = "forest";
const LIGHT_THEME: &str = "light";

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let (theme, set_theme) = create_signal(LIGHT_THEME);

    create_effect(move |_| {
        match gloo_storage::LocalStorage::get::<String>("joeymckenzie.tech-theme") {
            Ok(stored_theme) => {
                if stored_theme == DARK_THEME {
                    set_theme(DARK_THEME);
                } else {
                    set_theme(LIGHT_THEME);
                }
            }
            Err(_) => logging::warn!("theme not found"),
        }
    });

    view! {
        <Html attr:data-theme=move || theme.get()/>
        <label class="swap swap-rotate">
            <input
                type="checkbox"
                class="theme-controller"
                value=move || theme.get()
                on:click=move |_| {
                    if theme.get() == DARK_THEME {
                        set_theme(LIGHT_THEME);
                        let _ = gloo_storage::LocalStorage::set(THEME_KEY, LIGHT_THEME);
                    } else {
                        set_theme(DARK_THEME);
                        let _ = gloo_storage::LocalStorage::set(THEME_KEY, DARK_THEME);
                    }
                }
            />

            <Show
                when=move || theme.get() == LIGHT_THEME
                fallback=|| view! { <span class="w-5 h-5 icon-[pixelarticons--sun]"></span> }
            >
                <span class="w-5 h-5 icon-[pixelarticons--moon]"></span>
            </Show>

        </label>
    }
}
