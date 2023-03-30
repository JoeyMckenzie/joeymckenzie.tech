use std::sync::Arc;

use axum::{
    extract::{Path, State},
    Json,
};
use serde::{Deserialize, Serialize};

use crate::{errors::ApiError, state::HandlerState};

#[derive(Serialize, Debug)]
pub struct StarsResponse {
    count: usize,
}

#[derive(Deserialize, Debug)]
pub struct GitHubRepositoryResponse {
    stargazers_count: usize,
}

pub async fn get_repository_stars(
    State(state): State<Arc<HandlerState>>,
    Path(repository): Path<String>,
) -> Result<Json<StarsResponse>, ApiError> {
    tracing::info!(
        "Received request to get start count for repository {}",
        repository
    );

    let url = format!("https://api.github.com/repos/joeymckenzie/{}", repository);
    dbg!(url.clone());

    let github_response = state
        .client
        .get(url)
        .bearer_auth(state.access_token.clone())
        .send()
        .await?;

    dbg!(&github_response);

    let parsed_response = github_response.json::<GitHubRepositoryResponse>().await?;

    let response = StarsResponse {
        count: parsed_response.stargazers_count,
    };

    Ok(Json(response))
}
