use leptos::*;
use leptos_router::*;
use serde::{Deserialize, Serialize};
use time::Date;

#[derive(Params, PartialEq)]
struct ContactParams {
    slug: String,
}

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq, Debug)]
pub struct Post {
    pub title: String,
    pub published_date: Date,
    pub views: i64,
    pub category: String,
    pub content: String,
}

#[server(GetBlogPost, "/blog", "GetJson")]
pub async fn get_blog_post() -> Result<Option<Post>, ServerFnError> {
    use axum::{
        extract::Path,
        http::{header, HeaderValue, Method},
    };
    use leptos_axum::extract;
    use leptos_axum::ResponseOptions;
    use sqlx::PgPool;
    use std::env;

    let (_, path): (Method, Path<String>) = extract().await?;

    logging::log!("{path:?}");

    if let Ok(slug) = path.parse::<String>() {
        dotenvy::dotenv()?;

        let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;
        let post: sqlx::Result<Option<Post>> = sqlx::query_as!(
            Post,
            r#"
SELECT title,
       published_date,
       views,
       category,
       parsed_content as content
FROM posts
WHERE slug = $1
        "#,
            slug
        )
        .fetch_optional(&pool)
        .await;

        if let Ok(Some(existing_post)) = post {
            let response = expect_context::<ResponseOptions>();
            response.insert_header(
                header::CACHE_CONTROL,
                HeaderValue::from_static("max-age=300"),
            );
            return Ok(Some(existing_post));
        }
    }

    leptos_axum::redirect("/");

    Ok(None)
}

#[component]
pub fn PostPage() -> impl IntoView {
    let post = create_resource(|| (), move |_| get_blog_post());

    view! { <div>"Post"</div> }
}
