use leptos::*;
use leptos_router::*;
use serde::{Deserialize, Serialize};
use time::{format_description, Date};

#[derive(Params, PartialEq)]
struct PostParams {
    slug: String,
}

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq, Debug)]
pub struct Post {
    pub title: String,
    pub published_date: Date,
    pub views: i64,
    pub category: String,
    pub content: String,
    pub hero_image: String,
}

#[server(GetBlogPost, "/blog", "GetJson")]
pub async fn get_blog_post(slug: String) -> Result<Option<Post>, ServerFnError> {
    use axum::http::{header, HeaderValue};
    use leptos_axum::ResponseOptions;
    use sqlx::PgPool;
    use std::env;

    dotenvy::dotenv()?;

    let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;
    let post: sqlx::Result<Option<Post>> = sqlx::query_as!(
        Post,
        r#"
SELECT title,
       published_date,
       views,
       category,
       parsed_content as content,
       hero_image
FROM posts
WHERE slug = $1
        "#,
        slug
    )
    .fetch_optional(&pool)
    .await;

    if let Ok(Some(existing_post)) = post {
        let response = expect_context::<ResponseOptions>();
        response.insert_header(
            header::CACHE_CONTROL,
            HeaderValue::from_static("max-age=300"),
        );
        return Ok(Some(existing_post));
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
                    if let Some(Ok(Some(post))) = post_resource.get() {
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
                        view! {
                            <article class="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md">
                                <h1 class="text-center text-2xl font-semibold">
                                    {post.title.clone()}
                                </h1>
                                <div class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight">
                                    <time dateTime=datetime_date>{display_date}</time>
                                    <div class="badge badge-neutral">{post.category}</div>
                                    <p>{post.views} views</p>
                                </div>
                                <img
                                    alt=format!("{} blog meme", post.title)
                                    src=post.hero_image
                                    height="400"
                                    width="500"
                                />
                                <div inner_html=post.content></div>
                            </article>
                        }
                    } else {
                        view! {
                            // Even though we redirect back to home, need to make the compiler happy here
                            <article></article>
                        }
                    }
                }}

            </Suspense>
        </div>
    }
}
