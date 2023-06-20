use axum::{response::IntoResponse, Json};
use http::StatusCode;
use serde::Serialize;
use thiserror::Error;

#[derive(Serialize, Debug)]
struct HandlerError {
    message: String,
}

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("The request to GitHub failed")]
    RequestFailed(#[from] reqwest::Error),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let (status, error_message) = match self {
            Self::RequestFailed(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
        };

        let body = Json(HandlerError {
            message: error_message,
        });

        (status, body).into_response()
    }
}
