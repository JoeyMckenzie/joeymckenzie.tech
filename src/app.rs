use crate::{
    components::{footer::Footer, navbar::Navbar},
    error_template::{AppError, ErrorTemplate},
    routes::{blog::BlogPage, home::HomePage, now::NowPage, post::PostPage},
};
use leptos::*;
use leptos_meta::*;
use leptos_router::*;

#[component]
pub fn App() -> impl IntoView {
    // Provides context that manages stylesheets, titles, meta tags, etc.
    provide_meta_context();

    view! {
        <Stylesheet id="leptos" href="/pkg/blog.css"/>

        // fonts
        <link rel="preconnect" href="https://fonts.bunny.net"/>
        <link
            href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap"
            rel="stylesheet"
        />

        // favicons
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>

        // sets the document title
        <Title text="Hi, I'm Joey. | joeymckenzie.tech"/>

        // content for this welcome page
        <Router fallback=|| {
            let mut outside_errors = Errors::default();
            outside_errors.insert_with_default_key(AppError::NotFound);
            view! { <ErrorTemplate outside_errors/> }.into_view()
        }>
            <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Navbar/>
                <Routes>
                    <Route path="/" view=HomePage/>
                    <Route path="/now" view=NowPage/>
                    <Route path="/blog" view=BlogPage/>
                    <Route path="/blog/:slug" view=PostPage/>
                </Routes>
                <Footer/>
            </main>
        </Router>
    }
}
