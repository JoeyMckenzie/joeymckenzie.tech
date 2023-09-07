use std::env::current_dir;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use std::process::Command;

const HTMX_UNPKG_URL: &str = "https://unpkg.com/htmx.org/dist/htmx.min.js";

fn main() {
    let build_enabled = std::env::var("BUILD_ENABLED")
        .unwrap_or("true".to_string())
        .parse::<bool>()
        .unwrap_or(true);

    if build_enabled {
        download_htmx();
        build_styles();
    }
}

/// Downloads the latest version of htmx and places it in our asset outputs for templates to reference
fn download_htmx() {
    let response = reqwest::blocking::get(HTMX_UNPKG_URL).expect("failed to reach unpkg");

    if !response.status().is_success() {
        eprintln!("request failed with status: {:?}", response.status());
        return;
    }

    // Build the path to our assets directory
    let current_dir = current_dir().expect("current directory not traceable");
    let out_dir = format!("{}/src/assets/js", current_dir.to_str().unwrap());
    let dest_path = Path::new(&out_dir).join("htmx.min.js");

    if dest_path.exists() {
        std::fs::remove_file(&dest_path).expect("failed to remove htmx file from path");
    }

    std::fs::create_dir_all(&out_dir).expect("failed to create js output directory");

    // Read the htmx
    let body = response.bytes().expect("failed to read response body");
    let mut file = File::create(format!(
        "{}/src/assets/js/htmx.min.js",
        current_dir.to_str().unwrap()
    ))
    .expect("failed to create the htmx output file");

    // Copy the response body to the local file
    file.write_all(&body)
        .expect("error while writing htmx to disk");

    println!("download completed!");
}

/// Compiles tailwind styles based on our configuration, removing used styles and reducing the bundle size
fn build_styles() {
    let command = "cargo";
    let args = vec!["make", "styles"]; // Replace with your actual arguments

    let status = Command::new(command)
        .args(args)
        .status()
        .expect("failed to compile styles");

    if status.success() {
        println!("styles successfully compiled!");
    } else {
        eprintln!(
            "error while attempting to compile styles: {:?}",
            status.code()
        );
        std::process::exit(1);
    }
}
