use std::sync::Arc;

use axum::extract::{Path, State};
use axum::routing::get;
use axum::{Json, Router};
use serde::Serialize;
use time::Date;

use crate::errors::ServerError;
use crate::AppState;

#[derive(Debug, Serialize)]
struct PostAggregate {
    data: Post,
    keywords: Vec<String>,
}

#[derive(Debug, Serialize)]
struct Post {
    title: String,
    description: String,
    published_date: Date,
    hero_image: String,
    category: String,
    views: i32,
    content: String,
}

pub fn new_posts_router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/:slug", get(find_post))
        .with_state(state)
}

async fn find_post(
    Path(slug): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<PostAggregate>, ServerError> {
    let post = sqlx::query_as!(
        Post,
        r#"
SELECT title,
       description,
       published_date,
       hero_image,
       category,
       views,
       parsed_content AS content
FROM posts
WHERE slug = $1
    "#,
        slug
    )
        .fetch_optional(&state.pool)
        .await?;

    match post {
        None => Err(ServerError::PostNotFound),
        Some(post) => {
            let keywords = sqlx::query!(
                r#"
SELECT word
FROM keywords k
JOIN keyword_post kp ON k.id = kp.keyword_id
JOIN posts p ON p.id = kp.post_id
WHERE p.slug = $1
                "#,
                slug
            )
                .fetch_all(&state.pool)
                .await?
                .into_iter()
                .map(|r| r.word)
                .collect::<Vec<String>>();

            Ok(Json(PostAggregate {
                data: post,
                keywords,
            }))
        }
    }
}
