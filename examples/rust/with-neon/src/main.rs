use anyhow::Context;
use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().context("failed to load environment variables")?;

    let database_url = std::env::var("DATABASE_URL").context("failed to load connection string")?;
    let _connection_pool = PgPoolOptions::new()
        .connect(&database_url)
        .await
        .context("failed to establish a connection to the database")?;

    Ok(())
}
