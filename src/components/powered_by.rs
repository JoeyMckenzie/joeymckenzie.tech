use leptos::*;
use leptos_router::A;

use crate::components::{theme_toggle::ThemeToggle, DisplayableIcon};

#[server(GetCommitSha)]
pub async fn get_commit_sha() -> Result<String, ServerFnError> {
    use axum::http::{header, HeaderValue};
    use leptos_axum::ResponseOptions;

    let commit_sha = std::env::var("COMMIT_SHA")?;
    let response = expect_context::<ResponseOptions>();
    response.insert_header(
        header::CACHE_CONTROL,
        HeaderValue::from_static("max-age=86400"),
    );

    Ok(commit_sha)
}

#[component]
pub fn PoweredBy() -> impl IntoView {
    let commit_sha = create_resource(|| (), move |_| get_commit_sha());
    let socials = create_rw_signal(vec![
        DisplayableIcon {
            href: "https://www.rust-lang.org/",
            display: "GitHub",
            icon: Some("icon-[simple-icons--rust]"),
        },
        DisplayableIcon {
            href: "https://leptos.dev",
            display: "Leptos",
            icon: Some("icon-[simple-icons--leptos]"),
        },
        DisplayableIcon {
            href: "https://fly.io",
            display: "Twitter",
            icon: Some("icon-[logos--fly-icon]"),
        },
    ]);

    view! {
        <div class="flex items-center justify-center space-x-4">
            <p class="my-auto text-xs text-center">"Powered by"</p>
            <For each=socials key=|social| social.display let:social>
                <A href=social.href class="flex my-auto hover:underline">
                    <span class="sr-only">{social.display}</span>
                    <span class=format!(
                        "h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 {}",
                        social.icon.unwrap(),
                    )></span>
                </A>
            </For>
            <Suspense fallback=|| {
                view! { <p class="text-sm">"Loading..."</p> }
            }>
                {move || {
                    if let Some(Ok(sha)) = commit_sha() {
                        view! {
                            <div class="text-xs">
                                <a
                                    rel="noreferrer"
                                    class="hover:underline"
                                    href=format!(
                                        "https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/{sha}",
                                    )
                                >

                                    {sha[..6].to_string()}
                                </a>
                            </div>
                        }
                    } else {
                        view! { <div></div> }
                    }
                }}

            </Suspense>
        </div>
    }
}
