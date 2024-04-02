use std::process::Command;

fn main() {
    // Run the NPM script using Command
    let output = Command::new("npm")
        .args(["run", "build"])
        .output()
        .expect("failed to execute NPM script");

    // Check if the NPM script ran successfully
    if !output.status.success() {
        panic!("failed to build frontend assets");
    }

    println!("successfully compiled frontend assets");
}
