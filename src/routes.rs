use axum::{
    extract::Path,
    response::{Html, IntoResponse},
};
use tera::Context as TeraContext;

use crate::cache::{BLOG_CONTENT_CACHE, TEMPLATE_CACHE};

pub async fn home() -> impl IntoResponse {
    let url = std::env::var("BASE_URL").unwrap();
    let mut context = tera::Context::new();
    context.insert("title", "joeymckenzie.tech");
    context.insert("description", "A guy that likes beer and code.");
    context.insert("canonicalURL", &url);
    context.insert("openGraphURL", &url);
    context.insert("openGraphImage", &url);
    context.insert("twitterImage", &url);

    let content = TEMPLATE_CACHE
        .get()
        .unwrap()
        .render("pages/home.html", &context)
        .unwrap();

    Html(content)
}

pub async fn blog() -> impl IntoResponse {
    let content = TEMPLATE_CACHE
        .get()
        .unwrap()
        .render("pages/blog.html", &TeraContext::new())
        .unwrap();

    Html(content)
}

pub async fn blog_page(Path(slug): Path<String>) -> impl IntoResponse {
    // Get the content from cache, where the cache key is the slug and the value is the bundled HTML with content response
    let blog_content = BLOG_CONTENT_CACHE.get().unwrap().get(&slug);

    match blog_content {
        Some(content) => content.to_owned(),
        None => {
            let not_found_page = TEMPLATE_CACHE
                .get()
                .unwrap()
                .render("pages/not-found.html", &TeraContext::new())
                .unwrap();

            Html(not_found_page)
        }
    }
}
