use sqlx::PgPool;

use crate::models::{Keyword, Post, PostAggregate, PostMetadata};

#[derive(Debug, Clone)]
pub struct PostRepository(PgPool);

impl PostRepository {
    pub fn new(pool: PgPool) -> Self {
        Self(pool)
    }

    pub async fn get_posts(&self) -> sqlx::Result<Vec<PostMetadata>> {
        sqlx::query_as!(
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
        .fetch_all(&self.0)
        .await
    }

    pub async fn get_latest_posts(&self) -> sqlx::Result<Vec<PostMetadata>> {
        sqlx::query_as!(
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
        .fetch_all(&self.0)
        .await
    }

    pub async fn find_post(&self, slug: String) -> anyhow::Result<Option<PostAggregate>> {
        let post: sqlx::Result<Option<Post>> = sqlx::query_as!(
            Post,
            r#"
SELECT id,
       title,
       published_date,
       views,
       category,
       parsed_content as content,
       hero_image,
       description
FROM posts
WHERE slug = $1
        "#,
            slug
        )
        .fetch_optional(&self.0)
        .await;

        if let Ok(Some(existing_post)) = post {
            let pool = self.0.clone();

            tokio::spawn(async move {
                // Not too concerned if there's an error during the updates
                let _ = sqlx::query!(
                    r#"
UPDATE posts
SET views = $1
WHERE slug = $2
            "#,
                    existing_post.views as i32 + 1,
                    slug
                )
                .execute(&pool)
                .await;
            });

            let keywords: sqlx::Result<Vec<Keyword>> = sqlx::query_as!(
                Keyword,
                r#"
SELECT k.word
FROM keyword_post kp
JOIN keywords k ON k.id = kp.keyword_id
WHERE kp.post_id = $1
        "#,
                existing_post.id
            )
            .fetch_all(&self.0)
            .await;

            if let Ok(existing_keywords) = keywords {
                let parsed_keywords = existing_keywords
                    .into_iter()
                    .map(|kw| kw.word)
                    .collect::<Vec<String>>();

                return Ok(Some(PostAggregate {
                    post: existing_post,
                    keywords: Some(parsed_keywords),
                }));
            }

            return Ok(Some(PostAggregate {
                post: existing_post,
                keywords: None,
            }));
        }

        Ok(None)
    }
}
