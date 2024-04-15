use leptos::*;

use crate::components::blog_preview::BlogPreview;

use super::PostMetadata;

#[component]
pub fn BlogPreviews(posts: Vec<PostMetadata>) -> impl IntoView {
    view! {
        <div class="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 py-12 sm:grid-cols-3">
            {posts
                .into_iter()
                .map(move |post| {
                    view! { <BlogPreview post=post/> }
                })
                .collect_view()}
        </div>
    }
}
