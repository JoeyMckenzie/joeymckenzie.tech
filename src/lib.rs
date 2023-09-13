// #![forbid(unsafe_code, dead_code)]
#![forbid(unsafe_code)]
#![warn(
    // missing_docs,
    missing_debug_implementations,
    missing_copy_implementations,
    trivial_casts,
    unused_allocation,
    trivial_numeric_casts,
    clippy::single_char_pattern,
    clippy::unwrap_used
)]

pub mod blogs;
pub mod cache;
mod errors;
pub mod routes;
