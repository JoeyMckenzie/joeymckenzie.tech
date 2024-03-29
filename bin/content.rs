use std::{env, fs, path::Path, process::Command};

use libsql::Builder;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().expect("failed to load environment");

    let url = env::var("LIBSQL_URL").expect("LIBSQL_URL must be set");
    let token = env::var("LIBSQL_AUTH_TOKEN").unwrap_or_default();
    let db = Builder::new_remote(url, token)
        .build()
        .await
        .expect("failed to connect");

    let conn = db.connect().unwrap();
    let mut rows = conn.query("SELECT * FROM view_counts", ()).await.unwrap();

    while let Some(row) = rows.next().await.unwrap() {
        dbg!(row);
    }

    let content_path = Path::new("content");

    if let Ok(entries) = fs::read_dir(content_path) {
        for entry in entries.flatten() {
            if let Ok(content_entries) = fs::read_dir(entry.path()) {
                for content_entry in content_entries.flatten() {
                    let output = Command::new("node")
                        .arg("bin/shiki.js")
                        .arg(content_entry.path()) // Specify the script to run
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
}
