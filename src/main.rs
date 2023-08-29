mod blogs;
mod routes;
mod state;

use std::{
    collections::HashMap,
    sync::{Arc, OnceLock, RwLock},
};

use anyhow::Context;
use axum::{routing::get, Router};
use blogs::BlogCache;
use routes::{blog, blog_page, home};
use state::AppState;
use tera::Tera;
use tower_http::services::ServeDir;

static TEMPLATES: OnceLock<Tera> = OnceLock::new();

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    load_templates()?;

    let assets_path = std::env::current_dir().unwrap();
    let port = 8000_u16;
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));

    let state = Arc::new(AppState {
        cache: RwLock::new(HashMap::new()),
    });

    let router = Router::new()
        .route("/", get(home))
        .route("/blog", get(blog))
        .route("/blog/:slug", get(blog_page))
        .nest_service(
            "/assets",
            ServeDir::new(format!("{}/src/assets", assets_path.to_str().unwrap())),
        )
        .with_state(state);

    axum::Server::bind(&addr)
        .serve(router.into_make_service())
        .await
        .expect("error while starting server");

    Ok(())
}

fn load_templates() -> anyhow::Result<()> {
    let templates = {
        let mut tera =
            Tera::new("src/templates/**/*").context("template directory was not found")?;
        tera.autoescape_on(vec![".html"]);
        tera
    };

    TEMPLATES
        .set(templates)
        .expect("could not initialize templates");

    Ok(())
}
