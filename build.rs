use std::env;
use std::process::Command;

fn main() {
    let project_dir = env::current_dir().unwrap();
    let compile_styles_status = Command::new("npm")
        .args(["run", "tailwind:compile"])
        .current_dir(project_dir)
        .status()
        .expect("failed to compile tailwind styles");

    assert!(compile_styles_status.success());
}
