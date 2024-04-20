use leptos::*;
use leptos_router::*;
use time::format_description;

use crate::models::PostMetadata;

#[component]
pub fn BlogPreview(post: PostMetadata) -> impl IntoView {
    let format_for_display =
        format_description::parse("[month repr:short] [day padding:none], [year]").unwrap();
    let format_for_datetime = format_description::parse("[year]-[month]-[day]").unwrap();
    let display_date = post.published_date.format(&format_for_display).unwrap();
    let datetime_date = post.published_date.format(&format_for_datetime).unwrap();

    view! {
        <article class="flex max-w-xl flex-col items-start hover:scale-102 transition duration-150 ease-in-out hover:-translate-y-1">
            <div class="flex items-center gap-x-4 text-xs">
                <time datetime=datetime_date>{display_date}</time>
                <div class="badge badge-neutral">{post.category}</div>
                <p>{format!("{} views", post.views)}</p>
            </div>
            <div class="group relative">
                <h3 class="mt-3 text-lg font-semibold leading-6">
                    <A href=format!("/blog/{}", post.slug)>
                        <span class="absolute inset-0"></span>
                        {post.title}
                    </A>
                </h3>
                <p class="mt-5 line-clamp-3 text-sm leading-6">{post.description}</p>
            </div>
        </article>
    }
}
