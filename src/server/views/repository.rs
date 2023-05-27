use sqlx::{query, query_as, FromRow, Pool, Postgres};
use tracing::info;

use crate::server::errors::AppServerError;

#[derive(Debug, FromRow)]
pub struct ViewCountQuery {
    id: i32,
    pub view_count: i32,
    pub slug: String,
}

#[derive(Debug)]
pub struct ViewCountRepository {
    pool: Pool<Postgres>,
}

impl ViewCountRepository {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }

    pub async fn create_view_count(&self, slug: String) -> Result<(), AppServerError> {
        info!("checking for existing slug {}", slug);
        let existing_view_count = query_as!(
            ViewCountQuery,
            r#"
SELECT *
FROM view_counts
WHERE slug = $1::text
            "#,
            slug
        )
        .fetch_optional(&self.pool)
        .await?;

        if let Some(view_count) = existing_view_count {
            info!(
                "slug {} found, incrementing view count from {}",
                slug, view_count.view_count
            );

            query!(
                r#"
UPDATE view_counts
SET view_count = $1::integer
WHERE slug = $2::text
                "#,
                view_count.view_count + 1,
                view_count.slug
            )
            .execute(&self.pool)
            .await?;
        } else {
            info!("slug {} not found, creating now", slug);
            query!(
                r#"
INSERT INTO view_counts (view_count, slug)
VALUES ($1::integer, $2::text)
            "#,
                1_i32,
                slug
            )
            .execute(&self.pool)
            .await?;
        }

        Ok(())
    }

    pub async fn get_view_count(&self, slug: String) -> Result<ViewCountQuery, AppServerError> {
        info!("retrieving view count for existing slug {}", slug);
        let existing_view_count = query_as!(
            ViewCountQuery,
            r#"
SELECT *
FROM view_counts
WHERE slug = $1::text
            "#,
            slug
        )
        .fetch_optional(&self.pool)
        .await?;

        if existing_view_count.is_none() {
            info!("slug {} not found, creating now", slug);
            let created_view_count = query_as!(
                ViewCountQuery,
                r#"
INSERT INTO view_counts (view_count, slug)
VALUES ($1::integer, $2::text)
RETURNING *
            "#,
                0_i32,
                slug
            )
            .fetch_one(&self.pool)
            .await?;

            return Ok(created_view_count);
        }

        Ok(existing_view_count.unwrap())
    }

    pub async fn get_view_counts(&self) -> Result<Vec<ViewCountQuery>, AppServerError> {
        let view_counts = query_as!(ViewCountQuery, "SELECT * FROM view_counts")
            .fetch_all(&self.pool)
            .await?;

        Ok(view_counts)
    }
}
