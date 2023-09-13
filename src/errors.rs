use axum::{http::StatusCode, response::IntoResponse};
use thiserror::Error;

#[derive(Error, PartialEq, Eq, Debug)]
pub enum AppError {
    #[error("An unexpected error occurred.")]
    InternalError,
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        match self {
            AppError::InternalError => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}
