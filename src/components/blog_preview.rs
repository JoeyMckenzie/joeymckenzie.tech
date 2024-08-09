use leptos::*;
use leptos_router::*;
use num_format::{Locale, ToFormattedString};
use time::format_description;

use crate::models::PostMetadata;

#[component]
pub fn BlogPreview(post: PostMetadata) -> impl IntoView {
    let format_for_display =
        format_description::parse("[month repr:short] [day padding:none], [year]").unwrap();
    let format_for_datetime = format_description::parse("[year]-[month]-[day]").unwrap();
    let display_date = post.published_date.format(&format_for_display).unwrap();
    let datetime_date = post.published_date.format(&format_for_datetime).unwrap();
    let formatted_views = post.views.to_formatted_string(&Locale::en);

    view! {
        <article class="flex flex-col items-start max-w-xl transition duration-150 ease-in-out hover:scale-102 hover:-translate-y-1">
            <div class="flex items-center text-xs gap-x-4">
                <time datetime=datetime_date>{display_date}</time>
                <div class="badge badge-neutral">{post.category}</div>
                <p>{format!("{} views", formatted_views)}</p>
            </div>
            <div class="relative group">
                <h3 class="mt-3 text-lg font-semibold leading-6">
                    <A href=format!("/blog/{}", post.slug)>
                        <span class="absolute inset-0"></span>
                        {post.title}
                    </A>
                </h3>
                <p class="mt-5 text-sm leading-6 line-clamp-3">{post.description}</p>
            </div>
        </article>
    }
}
