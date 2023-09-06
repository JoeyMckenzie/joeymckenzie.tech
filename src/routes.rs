use axum::{
    extract::Path,
    response::{Html, IntoResponse},
};
use tera::Context as TeraContext;

use crate::cache::{BLOG_META_CACHE, TEMPLATE_CACHE};

pub async fn home() -> impl IntoResponse {
    let url = "https://joeymckenzie.tech/";
    let mut context = tera::Context::new();
    context.insert("title", "joeymckenzie.tech");
    context.insert("description", "A guy that likes beer and code.");
    context.insert("canonicalURL", url);
    context.insert("openGraphURL", url);

    let content = TEMPLATE_CACHE
        .get()
        .expect("error")
        .render("pages/home.html", &context)
        .expect("error 2");

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
