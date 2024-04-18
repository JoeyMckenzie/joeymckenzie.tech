use leptos::*;
use leptos_meta::*;
use leptos_router::*;

const DARK_THEME: &str = "forest";
const LIGHT_THEME: &str = "light";

#[server(ToggleDarkMode, "/api/mode/toggle")]
pub async fn toggle_dark_mode(prefers_dark: bool) -> Result<bool, ServerFnError> {
    use http::{header::SET_COOKIE, HeaderMap, HeaderValue};
    use leptos_axum::{ResponseOptions, ResponseParts};

    let response = expect_context::<ResponseOptions>();
    let mut response_parts = ResponseParts::default();
    let mut headers = HeaderMap::new();
    headers.insert(
        SET_COOKIE,
        HeaderValue::from_str(&format!(
            "prefersdarkmode={prefers_dark}; Path=/; SameSite=lax"
        ))
        .expect("to create header value"),
    );
    response_parts.headers = headers;
    response.overwrite(response_parts);

    Ok(prefers_dark)
}

#[cfg(not(feature = "ssr"))]
fn initial_prefers_dark() -> bool {
    use wasm_bindgen::JsCast;

    logging::log!("running on client");

    let doc = document().unchecked_into::<web_sys::HtmlDocument>();
    let cookie = doc.cookie().unwrap_or_default();

    cookie.contains("prefersdarkmode=true")
}

#[cfg(feature = "ssr")]
fn initial_prefers_dark() -> bool {
    let prefers_dark = use_context::<http::request::Parts>()
        .map(|request| {
            request
                .headers
                .get("cookie")
                .map(|cookie| {
                    cookie
                        .to_str()
                        .map_or(false, |value| value.contains("prefersdarkmode=true"))
                })
                .unwrap_or(false)
        })
        .unwrap_or(false);

    prefers_dark
}

/// All credit to Greg here: https://github.com/leptos-rs/example-darkmode/blob/main/src/dark_mode.rs#L52
#[component]
pub fn ThemeToggle() -> impl IntoView {
    let toggle_dark_mode_action = create_server_action::<ToggleDarkMode>();
    let input = toggle_dark_mode_action.input();
    let value = toggle_dark_mode_action.value();
    let prefers_dark = move || {
        match (input(), value()) {
            // if there's some current input, use that optimistically
            (Some(submission), _) => submission.prefers_dark,
            // otherwise, if there was a previous value confirmed by server, use that
            (_, Some(Ok(value))) => value,
            // otherwise, use the initial value
            _ => initial_prefers_dark(),
        }
    };

    let color_scheme = move || {
        if prefers_dark() {
            DARK_THEME.to_string()
        } else {
            LIGHT_THEME.to_string()
        }
    };

    view! {
        <Html attr:data-theme=color_scheme/>
        <ActionForm action=toggle_dark_mode_action>
            <input type="hidden" name="prefers_dark" value=move || (!prefers_dark()).to_string()/>
            <button type="submit" class="flex items-center">
                {move || {
                    if prefers_dark() {
                        view! {
                            <span class="w-5 h-5 swap-off fill-current icon-[pixelarticons--sun]"></span>
                        }
                    } else {
                        view! {
                            <span class="w-5 h-5 swap-off fill-current icon-[pixelarticons--moon]"></span>
                        }
                    }
                }}

            </button>
        </ActionForm>
    }
}
