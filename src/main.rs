use std::sync::OnceLock;

use anyhow::Context;
use axum::{
    extract::Path,
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use tera::{Context as TeraContext, Tera};
use tower_http::services::ServeDir;

static TEMPLATES: OnceLock<Tera> = OnceLock::new();

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    load_templates()?;

    let assets_path = std::env::current_dir().unwrap();
    let port = 8000_u16;
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));

    let router = Router::new()
        .route("/", get(home))
        .route("/blog", get(blog))
        .route("/blog/:slug", get(blog_page))
        .nest_service(
            "/assets",
            ServeDir::new(format!("{}/src/assets", assets_path.to_str().unwrap())),
        );

    axum::Server::bind(&addr)
        .serve(router.into_make_service())
        .await
        .expect("error while starting server");

    Ok(())
}

async fn home() -> impl IntoResponse {
    let content = TEMPLATES
        .get()
        .unwrap()
        .render("pages/home.html", &TeraContext::new())
        .unwrap();

    Html(content)
}

async fn blog() -> impl IntoResponse {
    let content = TEMPLATES
        .get()
        .unwrap()
        .render("pages/blog.html", &TeraContext::new())
        .unwrap();

    Html(content)
}

async fn blog_page(Path(slug): Path<String>) -> impl IntoResponse {
    let mut context = TeraContext::new();
    context.insert("slug", &slug);

    let content = TEMPLATES
        .get()
        .unwrap()
        .render("pages/blog-page.html", &context)
        .unwrap();

    Html(content)
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
