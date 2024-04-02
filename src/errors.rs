use axum::http::StatusCode;
use axum::Json;
use axum::response::{IntoResponse, Response};
use serde_json::json;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ServerError {
    #[error(transparent)]
    QueryError(#[from] sqlx::Error),
    #[error("post was not found")]
    PostNotFound,
}

impl IntoResponse for ServerError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            Self::QueryError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            Self::PostNotFound => (StatusCode::NOT_FOUND, Self::PostNotFound.to_string()),
        };

        let body = json!({
            "message": error_message
        });

        (status, Json(body)).into_response()
    }
}
