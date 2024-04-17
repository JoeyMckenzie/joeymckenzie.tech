use leptos::*;
use leptos_meta::*;
use leptos_router::*;
use leptos_use::{use_color_mode_with_options, ColorMode, UseColorModeOptions, UseColorModeReturn};

const DARK_THEME: &str = "forest";
const LIGHT_THEME: &str = "light";

#[server(ToggleDarkMode, "/api/mode/toggle")]
pub async fn toggle_dark_mode() -> Result<(), ServerFnError> {
    let UseColorModeReturn { mode, set_mode, .. } =
        use_color_mode_with_options(UseColorModeOptions::default().cookie_enabled(true));

    match mode.get() {
        ColorMode::Light => {
            logging::log!("setting theme to dark");
            set_mode.set(ColorMode::Dark);
        }
        ColorMode::Dark => {
            logging::log!("setting theme to light");
            set_mode.set(ColorMode::Light);
        }
        _ => set_mode.set(ColorMode::Auto),
    }

    Ok(())
}

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let UseColorModeReturn { mode, .. } =
        use_color_mode_with_options(UseColorModeOptions::default().cookie_enabled(true));
    let toggle_dark_mode = create_server_action::<ToggleDarkMode>();
    let theme = move || match mode.get() {
        ColorMode::Light => LIGHT_THEME,
        ColorMode::Dark => DARK_THEME,
        _ => {
            logging::warn!("no theme detected");
            LIGHT_THEME
        }
    };

    view! {
        <Html attr:data-theme=theme/>
        <ActionForm action=toggle_dark_mode>
            <label class="swap swap-rotate">
                <input type="submit" class="theme-controller" value="forest"/>
                <span class="w-5 h-5 swap-off fill-current icon-[pixelarticons--moon]"></span>
                <span class="w-5 h-5 swap-on fill-current icon-[pixelarticons--sun]"></span>
            </label>
        </ActionForm>
    }
}
