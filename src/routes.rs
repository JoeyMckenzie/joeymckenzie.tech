use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{Html, IntoResponse},
};
use tera::Context as TeraContext;

use crate::{blogs::BlogFrontmatter, state::AppState, TEMPLATES};

pub async fn home() -> impl IntoResponse {
    let content = TEMPLATES
        .get()
        .unwrap()
        .render("pages/home.html", &TeraContext::new())
        .unwrap();

    Html(content)
}

pub async fn blog() -> impl IntoResponse {
    let content = TEMPLATES
        .get()
        .unwrap()
        .render("pages/blog.html", &TeraContext::new())
        .unwrap();

    Html(content)
}

pub async fn blog_page(
    Path(slug): Path<String>,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    let mut context = TeraContext::new();
    context.insert("slug", &slug);

    let cache_lock = state.cache.read().unwrap();

    let front_matter = BlogFrontmatter {
        title: todo!(),
        description: todo!(),
        tags: todo!(),
    };

    cache_lock
        .entry(slug)
        .or_insert_with(|| front_matter.into());

    let content = TEMPLATES
        .get()
        .unwrap()
        .render("pages/blog-page.html", &context)
        .unwrap();

    Html(content)
}
