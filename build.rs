use std::process::Command;

fn main() {
    println!("downloading htmx to assets");

    run_script("htmx");

    println!("htmx successfully downloaded, compiling styles");

    let styles_script_enabled = std::env::var("COMPILE_STYLES")
        .unwrap_or("true".to_string())
        .parse::<bool>()
        .unwrap_or(true);

    if styles_script_enabled {
        run_script("styles");
    }

    println!("styles successfully compiled!");
}

fn run_script(script: &str) {
    let status = Command::new("bash")
        .arg(format!("scripts/{}.sh", script))
        .status()
        .expect("failed to execute the script");

    if !status.success() {
        eprintln!("script execution failed");
        std::process::exit(1);
    }
}
