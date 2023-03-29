use std::sync::Arc;

use axum::{
    extract::{Path, State},
    Json,
};
use serde::Serialize;

use crate::{errors::ApiError, state::HandlerState};

#[derive(Serialize, Debug)]
pub struct StarsResponse {
    count: usize,
}

pub async fn get_repository_stars(
    State(state): State<Arc<HandlerState>>,
    Path(repository): Path<String>,
) -> Result<Json<StarsResponse>, ApiError> {
    tracing::info!(
        "Received request to get start count for repository {}",
        repository
    );
    let response = StarsResponse { count: 9000 };
    Ok(Json(response))
}
