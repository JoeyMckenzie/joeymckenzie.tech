use leptos::*;
use leptos_meta::*;
use leptos_router::*;

const COOKIE_NAME: &str = "joeymckenzie.tech-theme";
const DARK_THEME: &str = "forest";
const LIGHT_THEME: &str = "light";

#[server(ToggleTheme, "/api/mode/toggle")]
pub async fn toggle_theme() -> Result<(), ServerFnError> {
    use http::{header, HeaderMap, HeaderValue, StatusCode};
    use leptos_axum::{extract, ResponseOptions, ResponseParts};

    let response =
        use_context::<ResponseOptions>().expect("to have leptos_actix::ResponseOptions provided");
    let mut response_parts = ResponseParts::default();
    let mut headers = HeaderMap::new();
    headers.insert(
        header::SET_COOKIE,
        HeaderValue::from_str("darkmode=true; Path=/").expect("to create header value"),
    );
    response_parts.headers = headers;
    response.overwrite(response_parts);

    Ok(())
}

fn get_initial_theme() -> String {
    use leptos_use::{use_cookie, utils::FromToStringCodec};

    let (counter, set_counter) = use_cookie::<u32, FromToStringCodec>("counter");

    LIGHT_THEME.to_string()
}

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let toggle_theme = create_server_action::<ToggleTheme>();

    view! {
        <Html attr:data-theme=LIGHT_THEME/>
        <ActionForm action=toggle_theme>
            <button type="submit" class="flex items-center">
                <span class="w-5 h-5 swap-off fill-current icon-[pixelarticons--moon]"></span>
            </button>
        </ActionForm>
    }
}
