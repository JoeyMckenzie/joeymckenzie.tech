use leptos::*;
use leptos_meta::*;
use leptos_router::*;

const COOKIE_NAME: &str = "joeymckenzie.tech-theme";
const DARK_THEME: &str = "forest";
const LIGHT_THEME: &str = "light";

#[server(ToggleTheme, "/api/mode/toggle")]
pub async fn toggle_theme() -> Result<String, ServerFnError> {
    use axum_extra::extract::CookieJar;
    use http::{header, HeaderMap, HeaderValue};
    use leptos_axum::{extract, ResponseOptions, ResponseParts};

    let cookies: CookieJar = extract().await?;
    let mut updated_theme = LIGHT_THEME;

    if let Some(theme) = cookies.get(COOKIE_NAME) {
        updated_theme = if theme.value().eq(LIGHT_THEME) {
            DARK_THEME
        } else {
            LIGHT_THEME
        };
    }

    let response = expect_context::<ResponseOptions>();
    let mut response_parts = ResponseParts::default();
    let mut headers = HeaderMap::new();
    headers.insert(
        header::SET_COOKIE,
        HeaderValue::from_str(&format!(
            "{}={}; Path=/; SameSite=Lax",
            COOKIE_NAME, updated_theme,
        ))?,
    );
    response_parts.headers = headers;
    response.overwrite(response_parts);

    Ok(updated_theme.to_string())
}

#[server(GetCurrentTheme, "/api/mode")]
pub async fn get_current_theme() -> Result<String, ServerFnError> {
    use axum_extra::extract::CookieJar;
    use leptos_axum::extract;

    let cookies: CookieJar = extract().await?;

    if let Some(theme) = cookies.get(COOKIE_NAME) {
        dbg!(&theme);
        return Ok(theme.value().to_string());
    }

    Ok(LIGHT_THEME.to_string())
}

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let initial_mode = create_resource(|| (), move |_| get_current_theme());
    let toggle_theme = create_server_action::<ToggleTheme>();

    create_effect(move |_| {
        logging::log!("{:?}", toggle_theme.value().get());
    });

    view! {
        <Suspense>
            <Html attr:data-theme=move || match initial_mode.get() {
                Some(theme) => theme.unwrap_or(LIGHT_THEME.to_string()),
                None => LIGHT_THEME.to_string(),
            }/>
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
