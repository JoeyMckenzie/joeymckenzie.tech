use std::process::Command;

fn main() {
    // Run the NPM script using Command
    let output = Command::new("npm")
        .args(["run", "build"])
        .output()
        .expect("Failed to execute NPM script");

    // Check if the NPM script ran successfully
    if !output.status.success() {
        panic!("NPM script failed to run");
    }

    println!("NPM script ran successfully");
}
