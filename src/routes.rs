use axum::{
    extract::Path,
    response::{Html, IntoResponse},
};
use tera::Context as TeraContext;

use crate::cache::{BLOG_META_CACHE, TEMPLATE_CACHE};

pub async fn home() -> impl IntoResponse {
    let content = TEMPLATE_CACHE
        .get()
        .unwrap()
        .render("pages/home.html", &TeraContext::new())
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
    let blog = BLOG_META_CACHE.get().unwrap().get(&slug);

    let content = TEMPLATE_CACHE
        .get()
        .unwrap()
        .render("pages/blog-page.html", blog.unwrap())
        .unwrap();

    Html(content)
}
