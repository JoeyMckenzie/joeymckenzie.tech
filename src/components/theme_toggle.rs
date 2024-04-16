use leptos::*;
use leptos_router::*;
use leptos_use::{use_color_mode_with_options, ColorMode, UseColorModeOptions, UseColorModeReturn};

const DARK_THEME: &str = "forest";
const LIGHT_THEME: &str = "light";

#[server(ToggleDarkMode, "/api/mode/toggle")]
pub async fn toggle_dark_mode() -> Result<(), ServerFnError> {
    let UseColorModeReturn { mode, set_mode, .. } =
        use_color_mode_with_options(UseColorModeOptions::default().cookie_enabled(true));

    match mode.get() {
        ColorMode::Light => set_mode.set(ColorMode::Dark),
        ColorMode::Dark => set_mode.set(ColorMode::Light),
        _ => set_mode.set(ColorMode::Auto),
    }

    Ok(())
}

#[server(GetColorMode, "/api/mode")]
pub async fn get_color_mode() -> Result<String, ServerFnError> {
    use axum_extra::extract::CookieJar;
    use leptos_axum::*;

    let UseColorModeReturn { mode, .. } =
        use_color_mode_with_options(UseColorModeOptions::default().cookie_enabled(true));
    let jar: CookieJar = extract().await?;
    let mode = jar.get("leptos-use-color-scheme");

    if let Some(cookie_mode) = mode {
        if cookie_mode.value().eq_ignore_ascii_case("dark") {
            return Ok(DARK_THEME.to_string());
        }
    }

    Ok(LIGHT_THEME.to_string())
}

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let UseColorModeReturn { mode, set_mode, .. } =
        use_color_mode_with_options(UseColorModeOptions::default().cookie_enabled(true));
    let toggle_dark_mode = create_server_action::<ToggleDarkMode>();

    view! {
        <ActionForm action=toggle_dark_mode>
            <label class="swap swap-rotate">
                <input type="submit" class="theme-controller"/>

                {move || match mode.get() {
                    ColorMode::Light => {
                        view! { <span class="w-5 h-5 icon-[pixelarticons--moon]"></span> }
                    }
                    ColorMode::Dark => {
                        view! { <span class="w-5 h-5 icon-[pixelarticons--sun]"></span> }
                    }
                    _ => view! { <span></span> },
                }}

            </label>
        </ActionForm>
    }
}
