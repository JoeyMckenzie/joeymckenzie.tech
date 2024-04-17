#[cfg(feature = "ssr")]
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    use std::env;

    use axum::{routing::get, Router};
    use blog::fileserv::file_and_error_handler;
    use blog::state::AppState;
    use blog::{app::*, sitemap::generate_sitemap};
    use leptos::*;
    use leptos_axum::{generate_route_list, LeptosRoutes};
    use sqlx::PgPool;

    // Setting get_configuration(None) means we'll be using cargo-leptos's env values
    // For deployment these variables are:
    // <https://github.com/leptos-rs/start-axum#executing-a-server-on-a-remote-machine-without-the-toolchain>
    // Alternately a file can be specified such as Some("Cargo.toml")
    // The file would need to be included with the executable when moved to deployment
    let conf = get_configuration(None).await.unwrap();
    let leptos_options = conf.leptos_options;
    let addr = leptos_options.site_addr;
    let routes = generate_route_list(App);
    let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;
    let app_state = AppState {
        leptos_options: leptos_options.clone(),
        pool,
    };

    // build our application with a route
    let app = Router::new()
        .route("/sitemap-index.xml", get(generate_sitemap))
        .leptos_routes(&app_state, routes, App)
        .fallback(file_and_error_handler)
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    logging::log!("listening on http://{}", &addr);
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();

    Ok(())
}

#[cfg(not(feature = "ssr"))]
pub fn main() {
    // no client-side main function
    // unless we want this to work with e.g., Trunk for a purely client-side app
    // see lib.rs for hydration function instead
}
