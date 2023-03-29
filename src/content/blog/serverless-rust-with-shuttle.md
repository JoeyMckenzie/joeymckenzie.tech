---
title: 'Going serverless with Rust and Shuttle'
description: "Managing infrastructure is already hard enough, let's write some serverless Rust with Shuttle!"
pubDate: 'Apr 01 2023'
heroImage: '/blog/serverless-rust-with-shuttle/shuttle_meme.jpg'
category: 'rust'
---

In my epic quest to find any excuse to write more Rust in my daily dev life, I stumbled across an incredible platform that allows developers to write serverless functions entirely in Rust.

Serverless functions? Check.

Written in pure Rust? Check.

All managed from the comfort of the command line? _Dear god_... just take my money!

## What the deployment story currently looks like

Harkening back to looking for any excuse to write more Rust, my typical deployment workflow for small projects would look something like this:

- Write code (entirely bug-free, obviously)
- Construct a sensible Dockefile
- Deploy to [fly](https://fly.io/) for my server to run
- Configure CI to re-publish on pushes to `main`

While the current landscape of tools is small enough for micro-projects, I'd love to be an even lazier developer than I currently am and remove the middle to bullet points above. With shuttle, I'm able to write code and simply deploy my function - no containerization, no server configurations, simply just running a few commands and I'm able to go from local dev to production in minutes. Let's write a serverless function with shuttle that retrieves GitHub stars from one of our repositories!

## Getting started

First, let's bootstrap our shuttle project using [`cargo-shuttle`](https://crates.io/crates/cargo-shuttle/):

```bash
cargo install cargo-shuttle # or quickinstall if you prefer
```

Quick the shuttle CLI in place, let's scaffold out an [axum](https://crates.io/crates/axum/) server to respond to our requests:

```bash
cargo shuttle init --axum --name serverless-rust-with-shuttle
```

Taking a look at `main.rs` that shuttle generates for us should look something like this:

```rust
use axum::{routing::get, Router};

async fn hello_world() -> &'static str {
    "Hello, world!"
}

#[shuttle_runtime::main]
async fn axum() -> shuttle_axum::ShuttleAxum {
    let router = Router::new().route("/hello", get(hello_world));

    Ok(router.into())
}
```

and our manifest file will look something along the lines of:

```toml
[package]
name = "serverless-rust-with-shuttle"
version = "0.1.0"
edition = "2021"
publish = false

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
shuttle-runtime = "0.12.0"
axum = "0.6.12"
shuttle-axum = "0.12.0"
tokio = "1.26.0"
```

A few key notes here:

- Shuttle bootstraps a few dependencies for us in `shuttle-runtime` and `shuttle-axum` (0.12.0 at the time of this writing)
- These crates allow us to invoke our function as an axum-specific serverless application as we see in our `main.rs` file

But what's this `#[shuttle_runtime::main]` macro on our `main` function? Let's take a look with a quick `cargo rustc --profile=check -- -Zunpretty=expanded` (or simply [`cargo expand`](https://crates.io/crates/cargo-expand/) if you have it installed):

```bash
cargo rustc --profile=check -- -Zunpretty=expanded
    Checking serverless-rust-with-shuttle v0.1.0 (/path/to/serverless-rust-with-shuttle)
#![feature(prelude_import)]
#[prelude_import]
use std::prelude::rust_2021::*;
#[macro_use]
extern crate std;
use axum::{routing::get, Router};

async fn hello_world() -> &'static str { "Hello, world!" }

fn main() {
    let body = async { shuttle_runtime::start(loader).await; };

    #[allow(clippy :: expect_used, clippy :: diverging_sub_expression)]
    {
        return tokio::runtime::Builder::new_multi_thread().enable_all().build().expect("Failed building the Runtime").block_on(body);
    }
}
async fn loader(mut _factory: shuttle_runtime::ProvisionerFactory,
    logger: shuttle_runtime::Logger) -> shuttle_axum::ShuttleAxum {
    use shuttle_runtime::Context;
    use shuttle_runtime::tracing_subscriber::prelude::*;
    let filter_layer =
        shuttle_runtime::tracing_subscriber::EnvFilter::try_from_default_env().or_else(|_|
                    shuttle_runtime::tracing_subscriber::EnvFilter::try_new("INFO")).unwrap();
    shuttle_runtime::tracing_subscriber::registry().with(filter_layer).with(logger).init();
    axum().await
}
async fn axum() -> shuttle_axum::ShuttleAxum {
    let router = Router::new().route("/hello", get(hello_world));

    Ok(router.into())
}
    Finished dev [unoptimized + debuginfo] target(s) in 0.22s
[Shuttle](https://shuttle.rs/)
```

Whoa! If we look closely, we see a familiar bit of generated code:

```rust
#[allow(clippy :: expect_used, clippy :: diverging_sub_expression)]
{
    return tokio::runtime::Builder::new_multi_thread().enable_all().build().expect("Failed building the Runtime").block_on(body);
}
```

Shuttle's `#[shuttle_runtime::main]` macro generates the _same code_ a typical `#[tokio::main]` macro generates along with a few extra bits (like including the defacto logging crate in [`tracing`](https://crates.io/crates/tracing/) for logging to the server's console through [`tracing-subscriber`](https://crates.io/crates/tracing-subscriber)). No magic here, just a bit of generated boilerplate for us to hit the ground running.

A quick note, shuttle recently (at the time of this writing) added a dependencies on [protobuf](https://github.com/protocolbuffers/protobuf) to facilitate some of their internal infrastructure. If you're missing `protoc` as a dependency on your machine, take a look at my blog's [README](https://github.com/JoeyMckenzie/joey-mckenzie-tech/blob/main/README.md#running-shuttle-functions-locally) for some quick instructions on how to get up and running with the package.

## Managing secrets

So we've set out to build a serverless function that will retrieve stars from various repositories in GitHub, which implies we'll need to interact with the GitHub API. To use their API, we'll need a key to authenticate our requests but shouldn't rely on clients, nor expose our secret keys to clients. We'll need _some way_ to inject secrets at startup/runtime that'll house our API keys only known to the function so we can make valid requests - luckily shuttle has us covered with [shuttle secrets](https://docs.shuttle.rs/resources/shuttle-secrets).

Luckily, it's rather straightforward to secrets into our serverless function by adding a `Secrets.toml` file, shuttle's version of a `.env` file, and injecting them on startup with the [`shuttle-secrets`](https://crates.io/crates/shuttle-secrets) crate. Let's add that to our cargo dependencies:

```bash
cargo add shuttle-secrets
```

and in our `main` function, let's add the secrets store as an argument (don't forget to add a `use shuttle_secrets::SecretStore;` to your imports):

```rust
#[shuttle_runtime::main]
async fn axum(
    #[shuttle_secrets::Secrets] secret_store: SecretStore,
) -> shuttle_axum::ShuttleAxum {
  // other code...
}
```

While we're at it, we'll need a valid GitHub access token - for creating personal access tokens, check out the [docs](https://docs.github.com/en/apps/creating-github-apps/creating-github-apps/about-apps#personal-access-tokens) and make sure to add the `repo:read` scope so our authenticated requests have permission to retrieve repository data.

Once you've got your token (save it off as you'll only be able to see it once on the UI), let's add a `Secrets.toml` file at the root of our project with the token as a key:

```toml
GITHUB_ACCESS_TOKEN = "ghp..."
```

Now that we've got secrets in place, let's do a sanity check to make sure we have access to our token value once the function is running. Let's update our `main` function to spit out the token's value at startup:

```rust
#[shuttle_runtime::main]
async fn axum(#[shuttle_secrets::Secrets] secret_store: SecretStore) -> shuttle_axum::ShuttleAxum {
    let token = secret_store
        .get("GITHUB_ACCESS_TOKEN")
        .expect("No access token was provided.");

    dbg!(token);

    let router = Router::new().route("/hello", get(hello_world));

    Ok(router.into())
}
```

We'll simply just `.expect()` the token to exist as it's required for us to operate. Using shuttle's CLI, let's spin this function up locally:

```bash
cargo shuttle run
```

and after our project is compiled and run, we should see the token's value in our terminal:

```bash
Finished dev [unoptimized + debuginfo] target(s) in 30.18s
[samples/serverless-rust-with-shuttle/src/main.rs:14] token = "ghp..."

Starting serverless-rust-with-shuttle on http://127.0.0.1:8000
```

Sweet! We're 90% ready to start writing the _actual_ fun code. Since we'll need to call an external API via HTTP, let's add [`reqwest`](https://crates.io/crates/reqwest) as a dependency to make our lives easier (with the `json` feature):

```bash
cargo add reqwest --features json
```

Okay... _now_ we're ready to get the ball rolling. Let's update the existing route with a path parameter in the form of the repository name along with scaffolding out a handler in our `main` function:

```rust
use axum::{routing::get, Router};
use shuttle_secrets::SecretStore;

async fn get_repository_stars() -> &'static str {
    "Hello, world!"
}

#[shuttle_runtime::main]
async fn axum(#[shuttle_secrets::Secrets] secret_store: SecretStore) -> shuttle_axum::ShuttleAxum {
    let token = secret_store
        .get("GITHUB_ACCESS_TOKEN")
        .expect("No access token was provided.");

    let router = Router::new().route("/:repository/stars", get(get_repository_stars));

    Ok(router.into())
}
```

and with our server running, let's send through a request:

```bash
curl --location 'localhost:8000/my-repository/stars'
Hello, world!
```

Nice, now we're getting somewhere. Let's add [`cargo-watch`](https://crates.io/crates/cargo-watch) to have our server restart anytime we make changes so we're not bothered to stop/start manually ourselves:

```bash
cargo install cargo-watch # or cargo binstall
```

and running our server again:

```bash
cargo watch -x 'shuttle run'
```

Now any change to our source code will trigger an automatic restart of our server. Let's update our function handler to return some JSON in a sane fashion so we can start stubbing out what the request flow will look like. Back in `main.rs` let's update our handler as well as add a response JSON model:

```rust
#[derive(Serialize, Debug)]
struct StarsResponse {
    count: usize,
}

async fn get_repository_stars() -> Result<Json<StarsResponse>, &'static str> {
    let response = StarsResponse { count: 9000 };
    Ok(Json(response))
}
```

Ignoring our errors for just a bit, we'll need to bring in [`serde`](https://crates.io/crates/serde) so we can serialize our responses to JSON with the `derive` flag so we can use it on our struct:

```bash
cargo add serde --features derive
```

Compiling and running our server again, let's send another request through:

```bash
curl --location 'localhost:8000/my-repository/stars'
{"count":9000}
```

Now we're getting somewhere. We don't want to _just_ return errors in the form `&'static str`s, so let's address that by defining our own error implementation that plays nicely with axum:

```rust
#[derive(Serialize, Debug)]
struct HandlerError {
    message: String,
}

enum ApiError {}

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

async fn get_repository_stars() -> Result<Json<StarsResponse>, ApiError> {
    let response = StarsResponse { count: 9000 };
    Ok(Json(response))
}
```

Ignoring `clippy` errors for a moment, let's quickly run through our new additions:

- We've added a `HandlerError` struct to give us the ability to transform errors into user-friendly JSON responses with a `message`
- We've `impl`'d `InotoResponse` for our new `ApiError` type that we'll use to coerce errors that happen during the request into something axum understands how to transform
- We've updated our handler to return an `ApiError` in our `Result` rather than a static string so we can again help our users out with information about why the request failed

We'll get around to adding some branches to our `ApiError` enum eventually, but for now to get our code to compile, let's add the [`http`](https://crates.io/crates/http) crate so we can lean on the `StatusCode` type to map internal handler errors to sensible HTTP status codes.

> Handling errors with axum deserves it's on blog post, so I'll gloss over a few of the details for now so we can focus on just getting our function up and running.

```bash
cargo add http
```

Now running our code and making another request, we should still see the same message response as the previous request we made before we updated our handler. Our `main.rs` file is getting rather large, so let's split some things out for organization purposes. Let's add two additional files in `errors.rs` and `handlers.rs` to house our error implementation and request handlers, respectively

### errors.rs

```rust
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
```

### handlers.rs

```rust
use axum::Json;
use serde::Serialize;

use crate::errors::ApiError;

#[derive(Serialize, Debug)]
pub struct StarsResponse {
    count: usize,
}

pub async fn get_repository_stars() -> Result<Json<StarsResponse>, ApiError> {
    let response = StarsResponse { count: 9000 };
    Ok(Json(response))
}
```

After cleaning up a few import errors and peppering in a few `pub`s for visibility, our `main.rs` file should now look like:

```rust
mod errors;
mod handlers;

use axum::{routing::get, Router};
use handlers::get_repository_stars;
use shuttle_secrets::SecretStore;

#[shuttle_runtime::main]
async fn axum(#[shuttle_secrets::Secrets] secret_store: SecretStore) -> shuttle_axum::ShuttleAxum {
    let token = secret_store
        .get("GITHUB_ACCESS_TOKEN")
        .expect("No access token was provided.");

    let router = Router::new().route("/:repository/stars", get(get_repository_stars));

    Ok(router.into())
}
```

Nice and lean! Next, we need to _somehow_ get our token into our `get_repository_stars` handler in a sane fashion, and it would be nice to inject it as a dependency as it represents part of our serverless function's state. Let's lean on axum's [state management](https://docs.rs/axum/latest/axum/#sharing-state-with-handlers) mechanisms to do so with the `.with_state()` router extensions so we can inject the token secret into the handler at request time.

There are lots of ways to facilitate handling state in axum, so let's take the simplest approach by wrapping our token in a `struct` that'll we'll inject into our handlers. To keep things clean, let's add a `state.rs` file and the necessary bits to get a bit of thread-safe state working:

```rust
use std::sync::Arc;

#[derive(Debug)]
pub struct HandlerState {
    pub access_token: String,
}

impl HandlerState {
    pub fn new_state(access_token: String) -> Arc<HandlerState> {
        Arc::new(HandlerState { access_token })
    }
}

```

and back in our router in `main.rs`, let's add it as a state extension:

```rust
#[shuttle_runtime::main]
async fn axum(#[shuttle_secrets::Secrets] secret_store: SecretStore) -> shuttle_axum::ShuttleAxum {
    let token = secret_store
        .get("GITHUB_ACCESS_TOKEN")
        .expect("No access token was provided.");

    let router = Router::new()
        .route("/:repository/stars", get(get_repository_stars))
        .with_state(HandlerState::new_state(token));

    Ok(router.into())
}
```

Let's do one more sanity check to make sure we're still able to access our token within our request handler. Back in our `get_repository_stars handler`:

```rust
pub async fn get_repository_stars(
    State(state): State<Arc<HandlerState>>,
) -> Result<Json<StarsResponse>, ApiError> {
    dbg!(&state.access_token);
    let response = StarsResponse { count: 9000 };
    Ok(Json(response))
}
```

and thanks to `cargo-watch`, our server should be back up and running. Sending through yet another request, we should see our server output something like:

```bash
samples/serverless-rust-with-shuttle/src/handlers.rs:16] &state.access_token = "ghp..."
```

Nice! We're propagating down our state to our handler leaning on `Arc` to help us facilitate sharing our `HandlerState` across request threads and we're finally in a spot to start calling out to the GitHub API.

Before we do so, let's take a look at what we've got so far:

- We've got a serverless function spun with axum bootstrapped with shuttle
- We're handling errors according to axum convention
- We've separated out our bits of code into logical grouped units
- We're propagating top-level application state safely down to request handlers

Doesn't seem like much, but we've accomplished quite a bit! Let's go back and add a bit of `tracing` so we can see inside the mind of our function as its processing requests. Recall earlier in the expanded macro just above `main` that shuttle provides we have our application bootstrapped with `tracing` behind the scenes ready to go to start logging. Let's add some trace logging in a few places so we can pretty-print out to the console. First, let's add the `tracing` crate:

```bash
cargo add tracing
```

Next, let's update our `main` function to include a bit of startup-style logging:

```rust
#[shuttle_runtime::main]
async fn axum(#[shuttle_secrets::Secrets] secret_store: SecretStore) -> shuttle_axum::ShuttleAxum {
    tracing::info!("Bootstrapping function secrets");

    let token = secret_store
        .get("GITHUB_ACCESS_TOKEN")
        .expect("No access token was provided.");

    tracing::info!("Secrets successfully read, building server router");

    let router = Router::new()
        .route("/:repository/stars", get(get_repository_stars))
        .with_state(HandlerState::new_state(token));

    tracing::info!("Router successfully initialized, now listening on port 8000");

    Ok(router.into())
}
```

Then, let's add some logging to our request handler in `handlers.rs`:

```rust
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
```

Notice that I've added a `Path(repository): Path<String>` to our handler's input - this is axum's way of accessing dynamic route values based on the `:repository` path route from our router. Spinning up our function (or simply waiting if you're still `cargo watch`ing), we should the output in the console (omitting timestamps for brevity):

```bash
INFO serverless_rust_with_shuttle: Bootstrapping function secrets
INFO serverless_rust_with_shuttle: Secrets successfully read, building server router
INFO serverless_rust_with_shuttle: Router successfully initialized, now listening on port 8000

Starting serverless-rust-with-shuttle on http://127.0.0.1:8000
```

Sending a request through again, we should see the repository name from the route path being logged as well:

```bash
# From another terminal window...
curl --location 'localhost:8000/my-repository/stars'

# In our output console
INFO serverless_rust_with_shuttle::handlers: Received request to get start count for repository my-repository
```

Nice! Pat yourself on the back, we've written quite a bit of code and have a functioning server listening to requests. We still have two things left:

1. Calling the GitHub API to retrieve star counts
2. Deploying our function to production

## Deploying to shuttle

Before we finish up the core logic of our code, let's left-shift our deployment process a bit. Let's actually _deploy_ our function, verifying all our I's are dotted and T's crossed. Heading over to [shuttle](https://shuttle.rs)'s website and signing up, we should be met with a screen like the following:

![shuttle dashoboard](/blog/serverless-rust-with-shuttle/shuttle_dashboard.png)
