use anyhow::Context;
use axum::{routing::get, Router};
use joey_mckenzie_tech::{
    cache::{load_blog_meta_cache, TEMPLATE_CACHE},
    routes::{blog_page, blogs, home, not_found},
};
use tera::Tera;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().context("failed to load environment variables")?;

    load_templates()?;
    load_blog_meta_cache()?;

    let assets_path = std::env::current_dir().unwrap();
    let port = std::env::var("PORT").unwrap().parse::<u16>().unwrap();
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));

    let router = Router::new()
        .route("/", get(home))
        .route("/blog", get(blogs))
        .route("/blog/:slug", get(blog_page))
        .nest_service(
            "/assets",
            ServeDir::new(format!("{}/assets", assets_path.to_str().unwrap())),
        )
        .fallback(not_found);

    axum::Server::bind(&addr)
        .serve(router.into_make_service())
        .await
        .expect("error while starting server");

    Ok(())
}

fn load_templates() -> anyhow::Result<()> {
    let templates = {
        let mut tera = Tera::new("templates/**/*").context("template directory was not found")?;
        tera.autoescape_on(vec![".html"]);
        tera
    };

    TEMPLATE_CACHE
        .set(templates)
        .expect("could not initialize templates");

    Ok(())
}
