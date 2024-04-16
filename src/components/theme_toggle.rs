use leptos::*;
use leptos_meta::*;
use leptos_use::{use_color_mode_with_options, ColorMode, UseColorModeOptions, UseColorModeReturn};

const DARK_THEME: &str = "forest";
const LIGHT_THEME: &str = "light";

#[server(GetMode, "/api/mode")]
pub async fn get_color_mode() -> Result<String, ServerFnError> {
    use axum_extra::extract::CookieJar;
    use leptos_axum::*;

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
    let initial_color_mode = create_local_resource(|| (), move |_| get_color_mode());
    let UseColorModeReturn { mode, set_mode, .. } =
        use_color_mode_with_options(UseColorModeOptions::default().cookie_enabled(true));

    create_effect(move |_| {
        if let Some(Ok(color_mode)) = initial_color_mode.get() {
            if color_mode.eq(DARK_THEME) {
                set_mode(ColorMode::Dark);
            } else {
                set_mode(ColorMode::Light);
            }
        } else {
            logging::log!("no color");
        }
    });

    view! {
        <Suspense>
            {move || match initial_color_mode.get() {
                Some(matched_mode) => {
                    view! { <Html attr:data-theme=matched_mode.unwrap()/> }
                }
                None => {
                    view! {
                        <Html attr:data-theme=move || match mode.get() {
                            ColorMode::Light => LIGHT_THEME,
                            ColorMode::Dark => DARK_THEME,
                            _ => DARK_THEME,
                        }/>
                    }
                }
            }}
            // {move || match mode.get() {
            // ColorMode::Light => {
            // view! { <Html attr:data-theme=LIGHT_THEME/> }
            // }
            // ColorMode::Dark => {
            // view! { <Html attr:data-theme=DARK_THEME/> }
            // }
            // _ => view! {}.into_view(),
            // }}
            <label class="swap swap-rotate">
                <input
                    type="checkbox"
                    class="theme-controller"
                    on:click=move |_| match mode.get() {
                        ColorMode::Light => set_mode(ColorMode::Dark),
                        ColorMode::Dark => set_mode(ColorMode::Light),
                        _ => logging::warn!("color mode invalid"),
                    }
                />

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
        </Suspense>
    }
}
