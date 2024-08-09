use leptos::*;
use leptos_meta::*;
use leptos_router::*;
use time::format_description;

use crate::models::PostAggregate;

#[derive(Params, PartialEq)]
struct PostParams {
    slug: String,
}

#[server(GetBlogPost, "/blog", "GetJson")]
pub async fn get_blog_post(slug: String) -> Result<Option<PostAggregate>, ServerFnError> {
    use crate::state::AppState;

    let state = expect_context::<AppState>();

    if let Ok(post) = state.db.find_post(slug).await {
        return Ok(post);
    }

    leptos_axum::redirect("/");

    Ok(None)
}

#[component]
pub fn PostPage() -> impl IntoView {
    let params = use_params::<PostParams>();
    let slug = move || {
        params.with(|params| {
            params
                .as_ref()
                .map(|params| params.slug.clone())
                .unwrap_or_default()
        })
    };
    let post_resource = create_resource(slug, get_blog_post);

    view! {
        <div class="flex flex-col justify-center pt-12">
            <Suspense fallback=move || {
                view! {
                    <span class="py-12 flex justify-center mx-auto loading loading-ring loading-md"></span>
                }
            }>
                {move || {
                    if let Some(Ok(Some(post_aggregate))) = post_resource.get() {
                        let post = post_aggregate.post;
                        let format_for_display = format_description::parse(
                                "[month repr:short] [day padding:none], [year]",
                            )
                            .unwrap();
                        let format_for_datetime = format_description::parse("[year]-[month]-[day]")
                            .unwrap();
                        let display_date = post.published_date.format(&format_for_display).unwrap();
                        let datetime_date = post
                            .published_date
                            .format(&format_for_datetime)
                            .unwrap();
                        let keywords: String = post_aggregate.keywords.unwrap_or(vec![]).join(",");
                        view! {
                            <article class="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md">
                                <Title text=format!("{} | joeymckenzie.tech", post.title.clone()) />
                                <Meta name="description" content=post.description />
                                <Meta name="keywords" content=keywords />
                                <h1 class="text-center text-2xl font-semibold">
                                    {post.title.clone()}
                                </h1>
                                <div class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight">
                                    <time dateTime=datetime_date>{display_date}</time>
                                    <div class="badge badge-neutral">{post.category}</div>
                                    <p>{post.views}views</p>
                                </div>
                                <img
                                    alt=format!("{} blog meme", post.title)
                                    src=post.hero_image
                                    height="400"
                                    width="500"
                                />
                                <div inner_html=post.content></div>
                            </article>
                            <A href="/blog" class="flex justify-center">
                                <button class="btn">
                                    <span class="h-4 w-4 icon-[mdi--arrow-right]"></span>
                                    "Blogs"
                                </button>
                            </A>
                        }
                    } else {
                        view! {
                            // Even though we redirect back to home, need to make the compiler happy here
                            <article></article>
                            <A href="/blog" class="flex justify-center">
                                <button class="btn">
                                    <span class="h-4 w-4 icon-[mdi--arrow-left]"></span>
                                    "Blogs"
                                </button>
                            </A>
                        }
                    }
                }}

            </Suspense>
        </div>
    }
}
