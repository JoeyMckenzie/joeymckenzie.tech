use std::env;

use leptos::*;
use serde::{Deserialize, Serialize};
use time::Date;

#[derive(Serialize, Deserialize, Debug)]
pub struct PostMetadata {
    title: String,
    description: String,
    slug: String,
    published_date: Date,
    views: i64,
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

    view! { <div>"BlogPage"</div> }
}
