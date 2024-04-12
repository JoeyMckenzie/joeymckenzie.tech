use gloo_storage::Storage;
use leptos::*;

const DARK_THEME: &str = "forest";
const LIGHT_THEME: &str = "light";

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let (theme, set_theme) = create_signal(LIGHT_THEME);

    create_effect(move |_| {
        let current_theme = gloo_storage::LocalStorage::get::<String>("joeymckenzie.tech-theme");

        match current_theme {
            Ok(stored_theme) => {
                if stored_theme == DARK_THEME {
                    set_theme(DARK_THEME);
                } else {
                    set_theme(LIGHT_THEME)
                }
            }
            Err(_) => set_theme(DARK_THEME),
        }
    });

    view! {
        <label class="swap swap-rotate">
            <input
                type="checkbox"
                class="theme-controller"
                value=theme.get_untracked()
                on:click=move |_| {
                    if theme.get() == DARK_THEME {
                        set_theme(LIGHT_THEME);
                        let _ = gloo_storage::LocalStorage::set(
                            "joeymckenzie.tech-theme",
                            LIGHT_THEME,
                        );
                    } else {
                        set_theme(DARK_THEME);
                        let _ = gloo_storage::LocalStorage::set(
                            "joeymckenzie.tech-theme",
                            DARK_THEME,
                        );
                    }
                }
            />

            <Show
                when=move || theme.get() == LIGHT_THEME
                fallback=|| view! { <span class="w-5 h-5 icon-[pixelarticons--moon]"></span> }
            >
                <span class="w-5 h-5 icon-[pixelarticons--sun]"></span>
            </Show>

        </label>
    }
}
