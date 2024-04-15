use leptos::*;
use leptos_meta::*;
use leptos_use::{use_color_mode_with_options, ColorMode, UseColorModeOptions, UseColorModeReturn};

const DARK_THEME: &str = "forest";
const LIGHT_THEME: &str = "light";

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let UseColorModeReturn { mode, set_mode, .. } =
        use_color_mode_with_options(UseColorModeOptions::default().cookie_enabled(true));

    create_effect(move |_| logging::log!("mode {:?}", mode()));

    view! {
        <Html attr:data-theme=move || match mode.get() {
            ColorMode::Light => LIGHT_THEME,
            ColorMode::Dark => DARK_THEME,
            _ => DARK_THEME,
        }/>
        <label class="swap swap-rotate">
            <input
                type="checkbox"
                class="theme-controller"
                on:click=move |_| match mode() {
                    ColorMode::Light => set_mode(ColorMode::Dark),
                    ColorMode::Dark => set_mode(ColorMode::Light),
                    _ => logging::warn!("color mode invalid"),
                }
            />

            {move || match mode.get() {
                ColorMode::Light => {
                    view! { <span class="w-5 h-5 icon-[pixelarticons--moon]"></span> }
                }
                ColorMode::Dark => view! { <span class="w-5 h-5 icon-[pixelarticons--sun]"></span> },
                _ => view! { <span></span> },
            }}

        </label>
    }
}
