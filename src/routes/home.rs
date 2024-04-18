use leptos::*;
use leptos_meta::*;

use crate::components::{
    blog_previews::BlogPreviews, intro::Intro, social_buttons::SocialButtons, PostMetadata,
};

#[server(GetLatestBlogPosts, "/blogs/latest", "GetJson")]
pub async fn get_latest_blog_posts() -> Result<Vec<PostMetadata>, ServerFnError> {
    use crate::state::AppState;
    use axum::http::{header, HeaderValue};
    use leptos_axum::ResponseOptions;

    dotenvy::dotenv()?;

    let state = use_context::<AppState>().ok_or(
        ServerFnError::<server_fn::error::NoCustomError>::ServerError(
            "unable to get app state".to_string(),
        ),
    )?;
    let posts = sqlx::query_as!(
        PostMetadata,
        r#"
SELECT title,
       description,
       slug,
       published_date,
       views,
       category
FROM posts
ORDER BY published_date DESC
LIMIT 3
        "#
    )
    .fetch_all(&state.pool)
    .await?;

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

        </Suspense>
    }
}
