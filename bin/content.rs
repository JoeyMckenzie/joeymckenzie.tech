use std::{env, fs, io, path::Path, process::Command};

use gray_matter::{Matter, ParsedEntityStruct};
use gray_matter::engine::YAML;
use serde::Deserialize;
use sqlx::{PgPool, Postgres, Transaction};
use time::OffsetDateTime;

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

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv()?;

    let content_path = Path::new("content");

    if let Ok(entries) = fs::read_dir(content_path) {
        println!("initializing connection to Neon");

        let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;
        let mut tx: Transaction<'_, Postgres> = pool.begin().await?;

        println!("connection initialized, parsing content files");

        let matter = Matter::<YAML>::new();

        println!("content directory found, searching for content files");

        for entry in entries.flatten() {
            if let Ok(content_entries) = fs::read_dir(entry.path()) {
                for content_entry in content_entries.flatten() {
                    let content_file_path = content_entry.path();
                    if content_file_path.ends_with(".gitkeep") {
                        continue;
                    }

                    println!(
                        "content file found for {:?}, parsing content",
                        content_file_path
                    );
                    
                    let file_name = content_file_path.file_name().unwrap();
                    let file_contents = fs::read_to_string(content_file_path)?;
                    let parsed_content = matter
                        .parse_with_struct::<FrontMatter>(&file_contents)
                        .unwrap();

                    println!("content frontmatter parsed {:?}", parsed_content);
                    println!("calling shiki with markdown content");

                    let output = Command::new("node")
                        .args([SHIKI_PATH, &parsed_content.content])
                        .output()?;

                    println!("content highlighted, updating content in database");

                    if !output.status.success() {
                        let stderr = String::from_utf8(output.stderr).unwrap();

                        eprintln!("Error: {}", stderr.trim());

                        return Err(anyhow::Error::new(io::Error::new(
                            io::ErrorKind::InvalidInput,
                            "an error occurred attempting to highlight content with shiki",
                        )));
                    }

                    let shiki_output = String::from_utf8(output.stdout)?;

                    upsert_blog_post(parsed_content, shiki_output, &mut tx).await?;
                }
            }
        }

        tx.commit().await?;
    }

    Ok(())
}

async fn upsert_blog_post(
    parsed_content: ParsedEntityStruct<FrontMatter>,
    shiki_output: String,
    tx: &mut Transaction<'_, Postgres>,
) -> anyhow::Result<()> {
    sqlx::query!(
        r#"
INSERT INTO posts (created_at, updated_at, title, description, slug, published_date, hero_image, category, raw_content, parsed_content)
VALUES (current_timestamp, current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (slug) DO NOTHING
        "#,
        parsed_content.data.title,
        parsed_content.data.description,
        parsed_content.data.title,
        OffsetDateTime::now_utc().date(),
        parsed_content.data.title,
        parsed_content.data.title,
        parsed_content.data.title,
        shiki_output,
    ).execute(&mut **tx).await?;

    Ok(())
}
