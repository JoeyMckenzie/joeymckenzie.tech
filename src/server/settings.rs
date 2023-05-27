use anyhow::Context;
use config::{Config, File};
use serde_derive::Deserialize;

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct Database {
    pub max_db_connections: u8,
}

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct Server {
    pub timeout_duration_seconds: u8,
    pub port: u16,
    pub cors_origins: Vec<String>,
}

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct Settings {
    pub log_level: String,
    pub database: Database,
    pub server: Server,
}

impl Settings {
    pub fn new() -> anyhow::Result<Self> {
        let environment =
            std::env::var("RUST_ENV").context("runtime environment was not provided")?;

        let builder = Config::builder()
            .add_source(File::with_name(&format!("config/{}.toml", environment)).required(true))
            .build()
            .context("configuration was unable to build")?;

        let settings = builder
            .try_deserialize()
            .context("error while attempting set configuration")?;

        Ok(settings)
    }
}
