pub mod app;
mod components;
#[cfg(feature = "ssr")]
pub mod db;
pub mod error_template;
#[cfg(feature = "ssr")]
pub mod fileserv;
pub mod models;
mod routes;
#[cfg(feature = "ssr")]
pub mod sitemap;
pub mod spotify;
#[cfg(feature = "ssr")]
pub mod state;

#[cfg(feature = "hydrate")]
#[wasm_bindgen::prelude::wasm_bindgen]
pub fn hydrate() {
    use crate::app::*;
    console_error_panic_hook::set_once();
    leptos::mount_to_body(App);
}
