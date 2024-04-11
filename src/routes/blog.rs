use std::env;

use leptos::*;
use serde::{Deserialize, Serialize};
use time::Date;

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq, Debug)]
pub struct PostMetadata {
    pub title: String,
    pub description: String,
    pub slug: String,
    pub published_date: Date,
    pub views: i64,
}

#[server(GetBlogPosts, "/spotify")]
pub async fn get_blog_posts() -> Result<Vec<PostMetadata>, ServerFnError> {
    use sqlx::PgPool;

    dotenvy::dotenv()?;

    let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;
    let posts = sqlx::query_as!(
        PostMetadata,
        r#"
SELECT title,
       description,
       slug,
       published_date,
       views
FROM posts
ORDER BY published_date DESC
        "#
    )
    .fetch_all(&pool)
    .await?;

    Ok(posts)
}

#[component]
pub fn BlogPage() -> impl IntoView {
    let posts = create_resource(|| (), move |_| get_blog_posts());

    view! {
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
                view! { <span class="loading loading-ring loading-md"></span> }
            }>
                {move || match posts.get() {
                    Some(posts) => {
                        match posts {
                            Ok(posts_metadata) => {
                                view! {
                                    <div>
                                        {posts_metadata
                                            .into_iter()
                                            .map(move |post| {
                                                view! { <div>{post.title}</div> }
                                            })
                                            .collect_view()}
                                    </div>
                                }
                            }
                            Err(_) => {
                                view! { <div class="loading loading-ring loading-md"></div> }
                            }
                        }
                    }
                    None => {
                        view! { <div class="loading loading-ring loading-md"></div> }
                    }
                }}

            </Suspense>
        </div>
    }
}
