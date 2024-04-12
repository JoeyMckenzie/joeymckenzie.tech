use std::env;

use leptos::*;
use leptos_meta::*;

use crate::components::{blog_previews::BlogPreviews, PostMetadata};

#[server(GetBlogPosts, "/blogs", "GetJson")]
pub async fn get_blog_posts() -> Result<Vec<PostMetadata>, ServerFnError> {
    use axum::http::{header, HeaderValue};
    use leptos_axum::ResponseOptions;
    use sqlx::PgPool;

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
pub fn BlogPage() -> impl IntoView {
    let posts = create_resource(|| (), move |_| get_blog_posts());

    view! {
        <Title text="Blog. | joeymckenzie.tech"/>

        <div class="py-12 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl pb-12">
                <h2 class="text-center text-4xl font-extrabold tracking-tight sm:text-4xl">
                    "Blog."
                </h2>
                <p class="mx-auto mt-6 max-w-xl text-justify">
                    "I write about a lot of things, mainly languages, ecosystems,
                    and software design. I consider my writing a journal of
                    technologies I've worked with at some point during my
                    career, and I'm always happy to field questions and
                    conversations from interested readers. Feel free to"
                    <a href="mailto:joey.mckenzie.dev@gmail.com">"contact me"</a>
                    "about any of the writing I do here, or to simply say hello!"
                </p>
            </div>
            // <BlogPreviews :front-matters="frontMatters" />
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
        </div>
    }
}
