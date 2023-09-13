use axum::response::{IntoResponse, Response};
use thiserror::Error;

use crate::routes;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("An unexpected error occurred.")]
    InternalError,
    #[error("An error occurred reading an environment variable.")]
    EnvVarUnreadable(#[from] std::env::VarError),
    #[error("An error occurred attempting to render a template.")]
    TemplateRenderError(#[from] tera::Error),
    #[error("Blog page was not found.")]
    BlogPageNotFound,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let error = match self {
            AppError::InternalError => routes::get_internal_error_page(),
            AppError::EnvVarUnreadable(_) => routes::get_internal_error_page(),
            AppError::TemplateRenderError(_) => todo!(),
            AppError::BlogPageNotFound => todo!(),
        };

        error.into_response()
    }
}
