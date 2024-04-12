use leptos::*;

use crate::components::{
    blog_previews::BlogPreviews, intro::Intro, social_buttons::SocialButtons, PostMetadata,
};

#[server(GetLatestBlogPosts, "/blogs/latest", "GetJson")]
pub async fn get_latest_blog_posts() -> Result<Vec<PostMetadata>, ServerFnError> {
    use axum::http::{header, HeaderValue};
    use leptos_axum::ResponseOptions;
    use sqlx::PgPool;
    use std::env;

    dotenvy::dotenv()?;

    let response = expect_context::<ResponseOptions>();
    let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;
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
    .fetch_all(&pool)
    .await?;

    response.insert_header(
        header::CACHE_CONTROL,
        HeaderValue::from_static("max-age=300"),
    );

    Ok(posts)
}

#[component]
pub fn HomePage() -> impl IntoView {
    let posts = create_resource(|| (), move |_| get_latest_blog_posts());

    view! {
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
