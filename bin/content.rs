use std::{env, fs, path::Path, process::Command};

use anyhow::Context;
use gray_matter::engine::YAML;
use gray_matter::Matter;
use serde::Deserialize;
use sqlx::PgPool;

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
    dotenvy::dotenv().expect("failed to load environment");

    let _pool = PgPool::connect(&env::var("DATABASE_URL")?)
        .await
        .context("failed to connect to database")?;

    let content_path = Path::new("content");
    let matter = Matter::<YAML>::new();

    if let Ok(entries) = fs::read_dir(content_path) {
        for entry in entries.flatten() {
            if let Ok(content_entries) = fs::read_dir(entry.path()) {
                for content_entry in content_entries.flatten() {
                    let file_contents = fs::read_to_string(content_entry.path())
                        .expect("failed to read contents of the file");
                    let parsed_content = matter
                        .parse_with_struct::<FrontMatter>(&file_contents)
                        .unwrap();
                    let output = Command::new("node")
                        .args(["bin/shiki.js", &parsed_content.content])
                        .output() // Execute the command and capture the output
                        .expect("Failed to execute command");

                    // Check if the command was successful
                    if output.status.success() {
                        // Convert the stdout bytes to a String
                        let stdout = String::from_utf8(output.stdout).unwrap();
                        println!("Node.js says: {}", stdout.trim());
                    } else {
                        // Handle the case where the command failed to execute
                        let stderr = String::from_utf8(output.stderr).unwrap();
                        eprintln!("Error: {}", stderr.trim());
                    }
                }
            }
        }
    }

    Ok(())
}
