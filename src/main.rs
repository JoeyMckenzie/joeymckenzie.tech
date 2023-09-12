use anyhow::Context;
use axum::{routing::get, Router};
use joey_mckenzie_tech::{
    cache::{load_blog_meta_cache, TEMPLATE_CACHE},
    routes::{blog_page, blogs, home, not_found},
};
use tera::Tera;
use tower_http::services::ServeDir;
use tracing::info;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().context("failed to load environment variables")?;

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new("info"))
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("environment initialized, loading templates and blog cache");

    load_templates()?;
    load_blog_meta_cache()?;

    info!("templates and blog cache initialized, building application routes");

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

    info!("router initialized, now serving on {port}");

    axum::Server::bind(&addr)
        .serve(router.into_make_service())
        .await
        .expect("error while starting server");

    Ok(())
}

#[tracing::instrument]
fn load_templates() -> anyhow::Result<()> {
    info!("intializing template cache");

    let templates = {
        let mut tera = Tera::new("templates/**/*").context("template directory was not found")?;
        tera.autoescape_on(vec![".html"]);
        tera
    };

    info!("templates found, initializing cache");

    TEMPLATE_CACHE
        .set(templates)
        .expect("could not initialize templates");

    info!("template cache successfully initialized");

    Ok(())
}
