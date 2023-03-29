use axum::{response::IntoResponse, Json};
use http::StatusCode;
use serde::Serialize;

#[derive(Serialize, Debug)]
struct HandlerError {
    message: String,
}

pub enum ApiError {}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let (status, error_message) = match self {
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Something very, very bad has happened... :(".to_string(),
            ),
        };

        let body = Json(HandlerError {
            message: error_message,
        });

        (status, body).into_response()
    }
}
