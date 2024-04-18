use leptos::*;
use leptos_meta::*;
use leptos_router::*;

const COOKIE_NAME: &str = "prefersdarkmode";
const DARK_THEME: &str = "forest";
const LIGHT_THEME: &str = "light";

#[server(ToggleTheme, "/api/mode/toggle")]
pub async fn toggle_theme() -> Result<String, ServerFnError> {
    use axum_extra::extract::CookieJar;
    use http::{header, HeaderMap, HeaderValue};
    use leptos_axum::{extract, ResponseOptions, ResponseParts};

    let cookies: CookieJar = extract().await?;
    let prefers_dark = cookies
        .get(COOKIE_NAME)
        .is_some_and(|cookie| cookie.value().parse::<bool>().unwrap_or(false));
    let response = expect_context::<ResponseOptions>();
    let mut response_parts = ResponseParts::default();
    let mut headers = HeaderMap::new();

    headers.insert(
        header::SET_COOKIE,
        HeaderValue::from_str(&format!(
            "{}={}; Path=/; SameSite=Lax",
            COOKIE_NAME, prefers_dark,
        ))?,
    );
    response_parts.headers = headers;
    response.overwrite(response_parts);

    Ok(prefers_dark.to_string())
}

#[cfg(not(feature = "ssr"))]
fn initial_prefers_dark() -> bool {
    use wasm_bindgen::JsCast;

    logging::log!("checking theme for wasm");

    let doc = document().unchecked_into::<web_sys::HtmlDocument>();
    let cookie = doc.cookie().unwrap_or_default();
    let initial = cookie.contains(&format!("{}=true", COOKIE_NAME));

    logging::log!("theme is {initial}");

    initial
}

#[cfg(feature = "ssr")]
fn initial_prefers_dark() -> bool {
    use axum::http::HeaderMap;
    use axum_extra::extract::CookieJar;

    logging::log!("checking theme for ssr");

    let context = use_context::<axum::http::Request<HeaderMap>>();
    dbg!(&context);

    // let initial = context.is_some_and(|cookies| {
    //     dbg!(&cookies);
    //     cookies
    //         .get(COOKIE_NAME)
    //         .is_some_and(|cookie| cookie.value().parse::<bool>().unwrap_or(false))
    // });
    let initial = false;

    logging::log!("theme is {initial}");

    initial
}

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let prefers_dark = initial_prefers_dark();
    let toggle_theme = create_server_action::<ToggleTheme>();

    create_effect(move |_| {
        logging::log!("{:?}", toggle_theme.value().get());
    });

    let theme = move || {
        if prefers_dark {
            DARK_THEME
        } else {
            LIGHT_THEME
        }
    };

    view! {
        <Suspense>
            <Html attr:data-theme=theme()/>
            <ActionForm action=toggle_theme>
                <button type="submit" class="flex items-center">
                    <Show
                        when=move || match toggle_theme.value().get() {
                            Some(theme) => theme.unwrap_or(LIGHT_THEME.to_string()).eq(LIGHT_THEME),
                            None => false,
                        }

                        fallback=|| {
                            view! {
                                <span class="w-5 h-5 fill-current icon-[pixelarticons--sun]"></span>
                            }
                        }
                    >

                        <span class="w-5 h-5 fill-current icon-[pixelarticons--moon]"></span>
                    </Show>
                </button>
            </ActionForm>
        </Suspense>
    }
}
