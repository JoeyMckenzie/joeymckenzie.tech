use std::ffi::OsStr;
use std::{env, fs, io, path::Path, process::Command};

use gray_matter::engine::YAML;
use gray_matter::{Matter, ParsedEntityStruct};
use serde::Deserialize;
use sqlx::{PgPool, Postgres, Transaction};
use time::macros::format_description;
use time::Date;
use tracing::{error, info};
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

const SHIKI_PATH: &str = "bin/shiki.js";

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct FrontMatter {
    title: String,
    description: String,
    pub_date: String,
    hero_image: String,
    category: String,
    keywords: Vec<String>,
}

#[cfg(feature = "content")]
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv()?;

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "content=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let content_path = Path::new("content");

    if let Ok(entries) = fs::read_dir(content_path) {
        info!("initializing connection to Neon");

        let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;
        let mut tx: Transaction<'_, Postgres> = pool.begin().await?;

        info!("connection initialized, parsing content files");

        let matter = Matter::<YAML>::new();

        info!("content directory found, searching for content files");

        for entry in entries.flatten() {
            if let Ok(content_entries) = fs::read_dir(entry.path()) {
                for content_entry in content_entries.flatten() {
                    let content_file_path = content_entry.path();
                    if content_file_path.ends_with(".gitkeep") {
                        continue;
                    }

                    let file_slug = content_file_path.file_stem().unwrap();

                    info!("content file found for {:?}, parsing content", file_slug);

                    let file_contents = fs::read_to_string(&content_file_path)?;
                    let parsed_content = matter
                        .parse_with_struct::<FrontMatter>(&file_contents)
                        .unwrap();

                    info!("content frontmatter parsed {:?}", parsed_content.data);
                    info!("calling shiki with markdown content");

                    let output = Command::new("node")
                        .args([SHIKI_PATH, &parsed_content.content])
                        .output()?;

                    info!("content highlighted, updating content in database");

                    if !output.status.success() {
                        let stderr = String::from_utf8(output.stderr).unwrap();

                        error!("Error: {}", stderr.trim());

                        return Err(anyhow::Error::new(io::Error::new(
                            io::ErrorKind::InvalidInput,
                            "an error occurred attempting to highlight content with shiki",
                        )));
                    }

                    let shiki_output = String::from_utf8(output.stdout)?;

                    upsert_blog_post(file_slug, parsed_content, shiki_output, &mut tx).await?;
                }
            }
        }

        tx.commit().await?;
    }

    Ok(())
}

async fn upsert_blog_post(
    slug: &OsStr,
    parsed_content: ParsedEntityStruct<FrontMatter>,
    shiki_output: String,
    tx: &mut Transaction<'_, Postgres>,
) -> anyhow::Result<()> {
    let format = format_description!("[month repr:short] [day] [year]");
    let existing_post = sqlx::query!(
        r#"
SELECT id
FROM posts
WHERE slug = $1
    "#,
        slug.to_str().unwrap()
    )
    .fetch_optional(&mut **tx)
    .await?;

    let post_id = match existing_post {
        Some(post) => {
            info!("found existing post, updating content");
            sqlx::query!(
                r#"
UPDATE posts
SET updated_at = current_timestamp,
    title = $1,
    description = $2,
    published_date = $3,
    hero_image = $4,
    category = $5,
    raw_content = $6,
    parsed_content = $7
WHERE id = $8
        "#,
                parsed_content.data.title,
                parsed_content.data.description,
                Date::parse(&parsed_content.data.pub_date, &format)?,
                parsed_content.data.hero_image,
                parsed_content.data.category,
                parsed_content.content,
                shiki_output,
                post.id
            )
            .execute(&mut **tx)
            .await?;

            post.id
        }
        None => {
            info!("existing post not found, creating new entry");
            let row = sqlx::query!(
        r#"
INSERT INTO posts (created_at, updated_at, title, description, slug, published_date, hero_image, category, raw_content, parsed_content)
VALUES (current_timestamp, current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id
        "#,
                parsed_content.data.title,
                parsed_content.data.description,
                slug.to_str().unwrap(),
                Date::parse(&parsed_content.data.pub_date, &format)?,
                parsed_content.data.hero_image,
                parsed_content.data.category,
                parsed_content.content,
                shiki_output,
            ).fetch_one(&mut **tx).await?;

            row.id
        }
    };

    if !parsed_content.data.keywords.is_empty() {
        for keyword in parsed_content.data.keywords {
            let existing_keyword = sqlx::query!(
                r#"
SELECT id
FROM keywords
WHERE word = $1
                "#,
                keyword
            )
            .fetch_optional(&mut **tx)
            .await?;

            let keyword_id = match existing_keyword {
                Some(row) => {
                    info!("found existing entry for {keyword}");
                    row.id
                }
                None => {
                    info!("creating keyword entry for {keyword}");

                    let keyword_row = sqlx::query!(
                        r#"
INSERT INTO keywords (word)
VALUES ($1)
ON CONFLICT (word) DO NOTHING
RETURNING id
                "#,
                        keyword
                    )
                    .fetch_one(&mut **tx)
                    .await?;

                    keyword_row.id
                }
            };

            sqlx::query!(
                r#"
INSERT INTO keyword_post (post_id, keyword_id)
VALUES ($1, $2)
ON CONFLICT (post_id, keyword_id) DO NOTHING
                "#,
                post_id,
                keyword_id
            )
            .execute(&mut **tx)
            .await?;
        }
    }

    Ok(())
}
