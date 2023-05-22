use std::{net::SocketAddr, sync::Arc};

use axum::{
    extract::{Path, State},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, query_as, PgPool};
use uuid::Uuid;

struct AppState {
    pool: PgPool,
}

#[derive(Deserialize, Serialize, Debug)]
struct LogBeerRequest {
    pub name: String,
    pub notes: String,
}

#[derive(Serialize)]
struct LogBeerResponse {
    pub id: Uuid,
}

async fn howdy() -> &'static str {
    "Well, hello there partner!"
}

async fn create_log(
    State(state): State<Arc<AppState>>,
    Json(beer_notes_request): Json<LogBeerRequest>,
) -> Json<LogBeerResponse> {
    println!(
        "Received request to create beer log {:?}",
        beer_notes_request
    );

    let result = query_as!(
        LogBeerResponse,
        r"
        INSERT INTO beer_logs (name, notes)
        VALUES ($1, $2)
        RETURNING id
        ",
        beer_notes_request.name,
        beer_notes_request.notes
    )
    .fetch_one(&state.pool)
    .await
    // DON'T panic in production... this is not an endorsement!
    .unwrap_or_else(|_| panic!("inserting beer log {:?} failed", beer_notes_request));

    Json(result)
}

async fn get_log(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Json<LogBeerRequest> {
    println!("Received request to retrieve beer log {}", id);

    let result = query_as!(
        LogBeerRequest,
        r"
        SELECT name, notes FROM beer_logs
        WHERE id = $1
        ",
        id,
    )
    .fetch_one(&state.pool)
    .await
    // DON'T panic in production... this is not an endorsement!
    .unwrap_or_else(|_| panic!("retrieving beer log {:?} failed", id));

    Json(result)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Require a port and connection string to run, we can configure these with fly
    let connection_string = std::env::var("DATABASE_URL").expect("connection pool was not found");
    let port = std::env::var("PORT")?
        .parse::<u16>()
        .expect("port is not valid");

    println!("Initializing connection pool...");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&connection_string)
        .await?;
    println!("Connection pool initialized, running migrations...");

    sqlx::migrate!().run(&pool).await?;

    println!("Migrations successfully applied! Initializing router...");

    // Create a bit of state to share the connection pool and spint up the router
    let state = AppState { pool };
    let router = Router::new()
        .route("/howdy", get(howdy))
        .route("/logs", post(create_log))
        .route("/logs/:id", get(get_log))
        .with_state(Arc::new(state));

    println!("Router initialized, now listening on port {}", port);

    // Bind to whatever the hosting interface is - localhost on our dev machine, fly's domain once deployed
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    axum::Server::bind(&addr)
        .serve(router.into_make_service())
        .await
        .unwrap();

    Ok(())
}
