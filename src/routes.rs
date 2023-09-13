use axum::{
    extract::Path,
    http::StatusCode,
    response::{Html, IntoResponse},
};
use tera::Context as TeraContext;

use crate::{
    cache::{BLOG_CONTENT_CACHE, TEMPLATE_CACHE},
    errors::AppError,
};

type PageResult = Result<Html<String>, AppError>;

pub async fn home() -> PageResult {
    let context = get_tera_context("Hi, I'm Joe.", "A guy that likes beer and code.")?;

    if let Some(content_cache) = TEMPLATE_CACHE.get() {
        let content = content_cache.render("pages/home.html", &context)?;
        return Ok(Html(content));
    }

    let content = TEMPLATE_CACHE
        .get()
        .unwrap()
        .render("pages/home.html", &context)
        .unwrap();

    Ok(Html(content))
}

pub async fn blogs() -> impl IntoResponse {
    let content = TEMPLATE_CACHE
        .get()
        .unwrap()
        .render("pages/blog.html", &TeraContext::new())
        .unwrap();

    Html(content)
}

pub async fn blog_page(Path(slug): Path<String>) -> PageResult {
    // Get the content from cache, where the cache key is the slug and the value is the bundled HTML with content response
    let blog_content = BLOG_CONTENT_CACHE.get().unwrap().get(&slug);

    match blog_content {
        Some(content) => Ok(content.to_owned()),
        None => Err(AppError::BlogPageNotFound),
    }
}

pub async fn not_found() -> PageResult {
    let context = get_tera_context("Gone fishing.", "A guy that likes beer and code.")?;

    if let Some(tera) = TEMPLATE_CACHE.get() {
        let rendered_template = tera.render("pages/not-found.html", &context)?;
        return Ok(Html(rendered_template));
    }

    match TEMPLATE_CACHE.get() {
        Some(tera) => {
            let rendered_template = tera.render("pages/not-found.html", &context)?;
            Ok(Html(rendered_template))
        }
        None => Err(AppError::InternalError),
    }
}

pub fn get_internal_error_page() -> impl IntoResponse {
    let context = tera::Context::new();
    (StatusCode::INTERNAL_SERVER_ERROR, Html("".to_string()))
}

pub fn get_tera_context(title: &str, description: &str) -> Result<tera::Context, AppError> {
    let url = std::env::var("BASE_URL")?;
    let mut context = tera::Context::new();
    context.insert("title", title);
    context.insert("description", description);
    context.insert("canonicalURL", &url);
    context.insert("openGraphURL", &url);
    context.insert("openGraphImage", &url);
    context.insert("twitterImage", &url);
    Ok(context)
}
