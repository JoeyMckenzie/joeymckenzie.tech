use std::env;

use leptos::*;
use leptos_meta::*;

use crate::{
    components::{blog_previews::BlogPreviews, section_intro::SectionIntro},
    models::PostMetadata,
};

#[server(GetBlogPosts, "/blogs", "GetJson")]
pub async fn get_blog_posts() -> Result<Vec<PostMetadata>, ServerFnError> {
    use crate::state::AppState;
    use axum::http::{header, HeaderValue};
    use leptos_axum::ResponseOptions;

    let state = expect_context::<AppState>();
    let posts = state.db.get_posts().await?;
    let response = expect_context::<ResponseOptions>();
    response.insert_header(
        header::CACHE_CONTROL,
        HeaderValue::from_static("max-age=300"),
    );

    Ok(posts)
}

#[component]
pub fn BlogPage() -> impl IntoView {
    let posts = create_resource(|| (), move |_| async move { get_blog_posts().await });

    view! {
        <Title text="Blog. | joeymckenzie.tech"/>

        <div class="py-12 sm:px-6 lg:px-8">
            <SectionIntro title=String::from(
                "Blog.",
            )>
                "I write about a lot of things, mainly languages, ecosystems,
                and software design. I consider my writing a journal of
                technologies I've worked with at some point during my
                career, and I'm always happy to field questions and
                conversations from interested readers. Feel free to"
                <a href="mailto:joey.mckenzie.dev@gmail.com">"contact me"</a>
                "about any of the writing I do here, or to simply say hello!"
            </SectionIntro>
            <Suspense fallback=|| {
                view! {
                    <span class="py-12 flex justify-center mx-auto loading loading-ring loading-md"></span>
                }
            }>
                {move || match posts.get() {
                    Some(posts) => {
                        match posts {
                            Ok(posts_metadata) => {
                                view! { <BlogPreviews posts=posts_metadata/> }
                            }
                            Err(_) => {
                                view! { <BlogPreviews posts=vec![]/> }
                            }
                        }
                    }
                    None => {
                        view! { <BlogPreviews posts=vec![]/> }
                    }
                }}

            </Suspense>
        </div>
    }
}
