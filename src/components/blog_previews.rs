use leptos::*;

use crate::{components::blog_preview::BlogPreview, models::PostMetadata};

#[component]
pub fn BlogPreviews(posts: Vec<PostMetadata>) -> impl IntoView {
    view! {
        <div class="grid max-w-3xl grid-cols-1 py-12 mx-auto gap-x-4 gap-y-12 sm:grid-cols-3">
            {posts
                .into_iter()
                .map(move |post| {
                    view! { <BlogPreview post=post /> }
                })
                .collect_view()}
        </div>
    }
}
