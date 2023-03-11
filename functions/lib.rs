mod handlers;
mod responses;
mod spotify;
mod state;

use axum::{
    http::{header, HeaderValue, Method},
    routing::get,
    Router,
};
use handlers::get_currently_listening_to;
use shuttle_secrets::SecretStore;
use state::build_config;

use sync_wrapper::SyncWrapper;
use tower_http::{cors::CorsLayer, timeout::TimeoutLayer};

#[shuttle_service::main]
async fn spotify(
    #[shuttle_secrets::Secrets] secret_store: SecretStore,
) -> shuttle_service::ShuttleAxum {
    let state = build_config(secret_store);

    // shuttle doesn't support secrets as vec as of now, set them publicly for now
    let origins = [
        "http://localhost:3000".parse::<HeaderValue>().unwrap(),
        "https://joeymckenzie.tech".parse::<HeaderValue>().unwrap(),
        "https://www.joeymckenzie.tech"
            .parse::<HeaderValue>()
            .unwrap(),
    ];

    let router = Router::new()
        .route("/spotify", get(get_currently_listening_to))
        .layer(TimeoutLayer::new(state.timeout_duration_seconds))
        .layer(
            CorsLayer::new()
                .allow_origin(origins)
                .allow_methods([Method::GET])
                .allow_headers([header::CONTENT_TYPE, header::ACCEPT]),
        )
        .with_state(state);

    let sync_wrapper = SyncWrapper::new(router);

    Ok(sync_wrapper)
}
