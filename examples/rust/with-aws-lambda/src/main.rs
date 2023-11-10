mod quotes;

use anyhow::Context;
use lambda_http::{run, service_fn, Body, Error, Request, RequestExt, Response};
use quotes::get_quotes;
use serde_json::json;
use tracing::info;

/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    info!("received request to get office quotes, loading quote data");

    // Load the quotes from our JSON file
    let quotes = get_quotes()?;

    // Grab a quote if an author name was sent along in the query params
    // If no author is sent, we'll grab a random quote from the JSON
    let quote = match event
        .query_string_parameters_ref()
        .and_then(|params| params.first("author"))
    {
        Some(author) => {
            info!("requested to retrieve quotes by author {author}");
            quotes.get_quote_by(author)
        }
        None => {
            info!("no author specified, retrieving a random quote");
            Some(quotes.get_random_quote())
        }
    };

    // Fineally, determine the response based on the authored quote we generated
    // If we successfully generated a quote, wrap it up in a nice JSON response
    // In the case an author was passed in via query param but no quote was found,
    // return an error response in JSON format with the help of serde_json's `json!()` macro
    match quote {
        Some(authored_quote) => {
            info!("quote retrieved by author {}", &authored_quote.author);

            let resp = Response::builder()
                .status(200)
                .header("content-type", "application/json")
                .body(
                    serde_json::to_string(&authored_quote)
                        .context("unable to serialize the hilarious quote")?
                        .into(),
                )
                .context("error attempting to build response body")?;

            Ok(resp)
        }
        None => {
            let resp = Response::builder()
                .status(404)
                .header("content-type", "application/json")
                .body(
                    json!({
                        "error": "Quote by that author does not exist."
                    })
                    .to_string()
                    .into(),
                )
                .context("error attempting build the error response")?;

            Ok(resp)
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    info!("bootstrapping lambda");

    run(service_fn(function_handler)).await
}
