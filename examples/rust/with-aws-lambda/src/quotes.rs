use std::{env::current_dir, fs::File, io::Read};

use anyhow::Context;
use rand::Rng;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Quote {
    author: String,
    quote: String,
}

#[derive(Debug, Deserialize)]
pub struct QuotesData {
    quotes: Vec<Quote>,
}

impl QuotesData {
    pub fn get_random_quote(&self) -> Quote {
        let random_index = rand::thread_rng().gen_range(0..self.quotes.len());
        self.quotes[random_index].clone()
    }

    pub fn get_quote_by(&self, author: &str) -> Option<Quote> {
        self.quotes
            .clone()
            .into_iter()
            .find(|q| q.author.to_lowercase().contains(&author.to_lowercase()))
    }
}

pub fn get_quotes() -> anyhow::Result<QuotesData> {
    let quotes_file_path = current_dir().context("unable to determine current directory")?;
    let mut file = File::open(format!(
        "{}/quotes.json",
        quotes_file_path.to_str().unwrap()
    ))
    .context("unable to read quotes file")?;
    let mut file_contents = String::new();
    file.read_to_string(&mut file_contents)
        .context("unable to read the file contents into buffer")?;

    serde_json::from_str::<QuotesData>(&file_contents).context("unable to parse quotes")
}
