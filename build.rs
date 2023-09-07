use std::env::current_dir;
use std::fs::File;
use std::io::Write;
use std::path::Path;

const HTMX_UNPKG_URL: &str = "https://unpkg.com/htmx.org/dist/htmx.min.js";

fn main() {
    // Send an HTTP GET request to the URL and store the response
    let response = reqwest::blocking::get(HTMX_UNPKG_URL).expect("failed to reach unpkg");

    // Check if the request was successful (status code 200)
    if !response.status().is_success() {
        eprintln!("request failed with status: {:?}", response.status());
        return;
    }

    // Get the file name from the URL and create a local file with that name
    let file_name = Path::new(HTMX_UNPKG_URL)
        .file_name()
        .and_then(|os_str| os_str.to_str())
        .unwrap_or("htmx.min.js");

    // Build the path to our assets directory
    let out_dir = {
        let current_dir = current_dir().expect("current directory not traceable");
        format!("{}/src/assets/js", current_dir.to_str().unwrap())
    };

    let dest_path = Path::new(&out_dir).join(file_name);
    let mut output_file = File::create(dest_path).expect("Failed to create output file");

    // Copy the response body to the local file
    let body = response.bytes().expect("Failed to read response body");
    output_file
        .write_all(&body)
        .expect("error while writing htmx to disk");

    println!("download completed!");
}
