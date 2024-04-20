use leptos::*;
use leptos_meta::*;
use leptos_router::*;

use crate::{
    components::{blog_previews::BlogPreviews, intro::Intro, social_buttons::SocialButtons},
    models::PostMetadata,
};

#[server(GetLatestBlogPosts, "/blogs/latest", "GetJson")]
pub async fn get_latest_blog_posts() -> Result<Vec<PostMetadata>, ServerFnError> {
    use crate::state::AppState;
    use axum::http::{header, HeaderValue};
    use leptos_axum::ResponseOptions;

    let state = expect_context::<AppState>();
    let posts = state.db.get_latest_posts().await?;

    let response = expect_context::<ResponseOptions>();
    response.insert_header(
        header::CACHE_CONTROL,
        HeaderValue::from_static("max-age=300"),
    );

    Ok(posts)
}

#[component]
pub fn HomePage() -> impl IntoView {
    let posts = create_resource(|| (), move |_| async move { get_latest_blog_posts().await });

    view! {
        <Title text="Hi, I'm Joey. | joeymckenzie.tech"/>
        <Intro/>
        <SocialButtons/>
        <div class="pt-12 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl">
                <h2 class="text-3xl font-bold tracking-tight text-center sm:text-4xl">
                    "Latest thoughts."
                </h2>
                <Suspense fallback=|| {
                    view! {
                        <span class="py-12 flex justify-center mx-auto loading loading-ring loading-md"></span>
                    }
                }>
                    {move || match posts.get() {
                        Some(posts) => {
                            match posts {
                                Ok(posts_metadata) => {
                                    view! { <BlogPreviews posts=posts_metadata/> }
                                }
                                Err(_) => {
                                    view! { <BlogPreviews posts=vec![]/> }
                                }
                            }
                        }
                        None => {
                            view! { <BlogPreviews posts=vec![]/> }
                        }
                    }}
                    <A href="/blog" class="flex justify-center">
                        <button class="btn">
                            "Blogs" <span class="h-4 w-4 icon-[mdi--arrow-right]"></span>
                        </button>
                    </A>
                </Suspense>
            </div>
        </div>
    }
}
