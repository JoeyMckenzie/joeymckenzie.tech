---
title: 'Going serverless with Rust and Shuttle'
description: "Managing infrastructure is already hard enough, let's write some serverless Rust with Shuttle!"
pubDate: 'Mar 30 2023'
heroImage: '/images/serverless-rust-with-shuttle/shuttle_meme.jpg'
category: 'rust'
keywords:
    - rust
    - aws lambda
---

In my epic quest to find any excuse to write more Rust in my daily dev life, I stumbled across an incredible platform
that allows developers to write serverless functions entirely in Rust.

Serverless functions? Check.

Written in pure Rust? Check.

All managed from the comfort of the command line? _Dear god_... just take my money!

## What the deployment story currently looks like

Harkening back to looking for any excuse to write more Rust, my typical deployment workflow for small projects would
look something like this:

-   Write code (entirely bug-free, obviously)
-   Construct a sensible Dockefile
-   Deploy to some sort managed SaaS infrastructure platform
-   Configure CI, testing pipelines, etc.

While the current landscape of tools is small enough for micro-projects, I'd love to be an even lazier developer than I
currently am and remove the middle to bullet points above. With shuttle, I'm able to write code and simply deploy my
function - no containerization, no server configurations, simply just running a few commands and I'm able to go from
local dev to production in minutes. Let's write a serverless function with shuttle that retrieves GitHub stars from one
of our repositories!

## Getting started

First, let's bootstrap our shuttle project using [`cargo-shuttle`](https://crates.io/crates/cargo-shuttle/):

```shell
cargo install cargo-shuttle # or quickinstall if you prefer
```

Quick the shuttle CLI in place, let's scaffold out an [axum](https://crates.io/crates/axum/) server to respond to our
requests:

```shell
cargo shuttle init --axum
```

Follow the prompts of naming the project and selecting a folder. Taking a look at `main.rs` that shuttle generates for
us should look something like this:

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

-   Shuttle bootstraps a few dependencies for us in `shuttle-runtime` and `shuttle-axum` (0.12.0 at the time of this
    writing)
-   These crates allow us to invoke our function as an axum-specific serverless application as we see in our `main.rs`
    file

But what's this `#[shuttle_runtime::main]` macro on our `main` function? Let's take a look with a
quick [`cargo expand`](https://crates.io/crates/cargo-expand/) if you have it installed:

```rust
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
```

Whoa! If we look closely, we see a familiar bit of generated code:

```rust
#[allow(clippy :: expect_used, clippy :: diverging_sub_expression)]
{
    return tokio::runtime::Builder::new_multi_thread().enable_all().build().expect("Failed building the Runtime").block_on(body);
}
```

Shuttle's `#[shuttle_runtime::main]` macro generates the _same code_ a typical `#[tokio::main]` macro generates along
with a few extra bits (like including the defacto logging crate in [`tracing`](https://crates.io/crates/tracing/) for
logging to the server's console through [`tracing-subscriber`](https://crates.io/crates/tracing-subscriber)). No magic
here, just a bit of generated boilerplate for us to hit the ground running.

A quick note, shuttle recently (at the time of this writing) added a dependency
on [protobuf](https://github.com/protocolbuffers/protobuf) to facilitate some of their internal infrastructure. If
you're missing `protoc` as a dependency on your machine, take a look at my
blog's [README](https://github.com/JoeyMckenzie/joey-mckenzie-tech/blob/main/README.md#running-shuttle-functions-locally)
for some quick instructions on how to get up and running with the package.

## Managing secrets

So we've set out to build a serverless function that will retrieve stars from various repositories in GitHub, which
implies we'll need to interact with the GitHub API. To use their API, we'll need a key to authenticate our requests but
shouldn't rely on clients, nor expose our secret keys to clients. We'll need _some way_ to inject secrets at
startup/runtime that'll house our API keys only known to the function so we can make valid requests - luckily shuttle
has us covered with [shuttle secrets](https://docs.shuttle.rs/resources/shuttle-secrets).

Luckily, it's rather straightforward to secrets into our serverless function by adding a `Secrets.toml` file, shuttle's
version of a `.env` file, and injecting them on startup with
the [`shuttle-secrets`](https://crates.io/crates/shuttle-secrets) crate. Let's add that to our cargo dependencies:

```shell
cargo add shuttle-secrets
```

and in our `main` function, let's add the secrets store as an argument (don't forget to add
a `use shuttle_secrets::SecretStore;` to your imports):

```rust
#[shuttle_runtime::main]
async fn axum(
    #[shuttle_secrets::Secrets] secret_store: SecretStore,
) -> shuttle_axum::ShuttleAxum {
  // other code...
}
```

While we're at it, we'll need a valid GitHub access token - for creating personal access tokens, check out
the [docs](https://docs.github.com/en/apps/creating-github-apps/creating-github-apps/about-apps#personal-access-tokens)
and make sure to add the `repo:read` scope so our authenticated requests have permission to retrieve repository data.

Once you've got your token (save it off as you'll only be able to see it once on the UI), let's add a `Secrets.toml`
file at the root of our project with the token as a key:

```toml
GITHUB_ACCESS_TOKEN = "ghp..."
```

Now that we've got secrets in place, let's do a sanity check to make sure we have access to our token value once the
function is running. Let's update our `main` function to spit out the token's value at startup:

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

We'll simply just `.expect()` the token to exist as it's required for us to operate. Using shuttle's CLI, let's spin
this function up locally:

```shell
cargo shuttle run
```

and after our project is compiled and run, we should see the token's value in our terminal:

```shell
Finished dev [unoptimized + debuginfo] target(s) in 30.18s
[samples/serverless-rust-with-shuttle/src/main.rs:14] token = "ghp..."

Starting serverless-rust-with-shuttle on http://127.0.0.1:8000
```

Sweet! We're 90% ready to start writing the _actual_ fun code. Since we'll need to call an external API via HTTP, let's
add [`reqwest`](https://crates.io/crates/reqwest) as a dependency to make our lives easier (with the `json` feature):

```shell
cargo add reqwest --features json
```

Okay... _now_ we're ready to get the ball rolling. Let's update the existing route with a path parameter in the form of
the repository name along with scaffolding out a handler in our `main` function:

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

```shell
curl --location 'localhost:8000/my-repository/stars'
Hello, world!
```

Nice, now we're getting somewhere. Let's add [`cargo-watch`](https://crates.io/crates/cargo-watch) to have our server
restart anytime we make changes so we're not bothered to stop/start manually ourselves:

```shell
cargo install cargo-watch # or cargo binstall
```

and running our server again:

```shell
cargo watch -x 'shuttle run'
```

Now any change to our source code will trigger an automatic restart of our server. Let's update our function handler to
return some JSON in a sane fashion so we can start stubbing out what the request flow will look like. Back in `main.rs`
let's update our handler as well as add a response JSON model:

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

Ignoring our errors for just a bit, we'll need to bring in [`serde`](https://crates.io/crates/serde) so we can serialize
our responses to JSON with the `derive` flag so we can use it on our struct:

```shell
cargo add serde --features derive
```

Compiling and running our server again, let's send another request through:

```shell
curl --location 'localhost:8000/my-repository/stars'
{"count":9000}
```

Now we're getting somewhere. We don't want to _just_ return errors in the form `&'static str`s, so let's address that by
defining our own error implementation that plays nicely with axum:

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

-   We've added a `HandlerError` struct to give us the ability to transform errors into user-friendly JSON responses with
    a `message`
-   We've `impl`'d `InotoResponse` for our new `ApiError` type that we'll use to coerce errors that happen during the
    request into something axum understands how to transform
-   We've updated our handler to return an `ApiError` in our `Result` rather than a static string so we can again help our
    users out with information about why the request failed

We'll get around to adding some branches to our `ApiError` enum eventually, but for now to get our code to compile,
let's add the [`http`](https://crates.io/crates/http) crate so we can lean on the `StatusCode` type to map internal
handler errors to sensible HTTP status codes.

> Handling errors with axum deserves it's on blog post, so I'll gloss over a few of the details for now so we can focus
> on just getting our function up and running.

```shell
cargo add http
```

Now running our code and making another request, we should still see the same message response as the previous request
we made before we updated our handler. Our `main.rs` file is getting rather large, so let's split some things out for
organizational purposes. Let's add two additional files in `errors.rs` and `handlers.rs` to house our error
implementation and request handlers, respectively

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

After cleaning up a few import errors and peppering in a few `pub`s for visibility, our `main.rs` file should now look
like this:

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

Nice and lean! Next, we need to _somehow_ get our token into our `get_repository_stars` handler in a sane fashion, and
it would be nice to inject it as a dependency as it represents part of our serverless function's state. Let's lean on
axum's [state management](https://docs.rs/axum/latest/axum/#sharing-state-with-handlers) mechanisms to do so with
the `.with_state()` router extensions so we can inject the token secret into the handler at request time.

There are lots of ways to facilitate handling state in axum, so let's take the simplest approach by wrapping our token
in a `struct` that'll we'll inject into our handlers. To keep things clean, let's add a `state.rs` file and the
necessary bits to get a bit of thread-safe state working:

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

Let's do one more sanity check to make sure we're still able to access our token within our request handler. Back in
our `get_repository_stars handler`:

```rust
pub async fn get_repository_stars(
    State(state): State<Arc<HandlerState>>,
) -> Result<Json<StarsResponse>, ApiError> {
    dbg!(&state.access_token);
    let response = StarsResponse { count: 9000 };
    Ok(Json(response))
}
```

and thanks to `cargo-watch`, our server should be back up and running. Sending through yet another request, we should
see our server output something like:

```shell
&state.access_token = "ghp..."
```

Nice! We're propagating down our state to our handler leaning on `Arc` to help us facilitate sharing our `HandlerState`
across request threads and we're finally in a spot to start calling out to the GitHub API.

Before we do so, let's take a look at what we've got so far:

-   We've got a serverless function spun with axum bootstrapped with shuttle
-   We're handling errors according to axum convention
-   We've separated out our bits of code into logically grouped units
-   We're propagating top-level application state safely down to request handlers

Doesn't seem like much, but we've accomplished quite a bit! Let's go back and add a bit of `tracing` so we can see
inside the mind of our function as it processes requests. Recall earlier in the expanded macro just above `main` that
shuttle provides we have our application bootstrapped with `tracing` behind the scenes ready to go to start logging.
Let's add some trace logging in a few places so we can pretty-print out to the console. First, let's add the `tracing`
crate:

```shell
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

Notice that I've added a `Path(repository): Path<String>` to our handler's input - this is axum's way of accessing
dynamic route values based on the `:repository` path route from our router. Spinning up our function (or simply waiting
if you're still `cargo watch`ing), we should the output in the console (omitting timestamps for brevity):

```shell
INFO serverless_rust_with_shuttle: Bootstrapping function secrets
INFO serverless_rust_with_shuttle: Secrets successfully read, building server router
INFO serverless_rust_with_shuttle: Router successfully initialized, now listening on port 8000

Starting serverless-rust-with-shuttle on http://127.0.0.1:8000
```

Sending a request through again, we should see the repository name from the route path being logged as well:

```shell
# From another terminal window...
curl --location 'localhost:8000/my-repository/stars'

# In our output console
INFO serverless_rust_with_shuttle::handlers: Received request to get start count for repository my-repository
```

Nice! Pat yourself on the back, we've written quite a bit of code and have a functioning server listening to requests.
We still have two things left:

1. Calling the GitHub API to retrieve star counts
2. Deploying our function to production

## Deploying to shuttle

Before we finish up the core logic of our code, let's left-shift our deployment process a bit. Let's deploy our
function, verifying all our I's are dotted and T's crossed. Heading over to [shuttle](https://shuttle.rs)'s website and
signing up, we should be met with a screen like the following:

![shuttle dashboard](/blog/serverless-rust-with-shuttle/shuttle_dashboard.png)

I'm also going to update the name of our function to something a bit more relevant with a `Shuttle.toml` file at the
root of our project:

```toml
name = "github-repository-star-counter"
```

You'll need to adjust the name as, sadly, I'll be taking this name for myself. Once you're authenticated, simply run the
deploy command `cargo shuttle deploy` and we should a bunch of internal logging from shuttle along with a successful
deploy message along the lines of:

```shell
These secrets can be accessed by github-repository-star-counter
╭─────────────────────╮
│         Keys        │
╞═════════════════════╡
│ GITHUB_ACCESS_TOKEN │
╰─────────────────────╯

Service Name:  github-repository-star-counter
Deployment ID: 3339ef4c-60f0-47e6-a159-5034ac03ad4f
Status:        running
Last Updated:  2023-03-29T23:09:40Z
URI:           https://github-repository-star-counter.shuttleapp.rs
```

Heck yeah! Our function has been deployed and also picked up our key from our `Secrets.toml` file. Let's test it out
by `curl`ing to the URI:

```shell
curl --location https://github-repository-star-counter.shuttleapp.rs/my-repository/stars
{"count":9000}
```

We've officially got serverless Rust running in production - how cool is that?

With our initial deployment out of the way, let's finish fleshing out our function to retrieve repository stars.

## Back to business

Let's add the client request to GitHub. Since we'll be establishing a connection to GitHub's API servers, rather than
spin up a new HTTP client per request, let's instantiate a single client at startup for our handlers to pull out of from
state. There are lots of benefits to recycling HTTP client connections throughout an application's lifetime, but that's
a bit beyond the scope of what we're doing today.

Let's update our `HandlerState` to include a `Client` from the `reqwest` crate:

```rust
use std::sync::Arc;

use reqwest::Client;

#[derive(Debug)]
pub struct HandlerState {
    pub access_token: String,
    pub client: Client,
}

impl HandlerState {
    pub fn new_state(access_token: String) -> Arc<HandlerState> {
        let client = Client::new();

        Arc::new(HandlerState {
            access_token,
            client,
        })
    }
}
```

Now that we'll have access to the HTTP client, let's test out a call to the repositories. The URL we'll be calling to
retrieve repository information will be in the form of `https://api.github.com/repos/OWNER/REPO` where we'll hard
code `OWNER` to be your username for now. Let's test a call out to see what the response looks like:

```shell
curl --request GET \
--url "https://api.github.com/repos/joeymckenzie/realworld-rust-axum-sqlx" \
--header "Accept: application/vnd.github+json" \
--header "Authorization: Bearer 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"
{
  "id": 485222387,
  "node_id": "R_kgDOHOvn8w",
  "name": "realworld-rust-axum-sqlx",
  // ...a ton of other properties
  "stargazers_count": 129,
}
```

We see in the response we get _a lot_ of other data that doesn't necessarily pertain to the number of stars on the
repositories. The only property we care about for now is the `stargazers_count` which represents the number of stars our
repository has. Let's create a response model to deserialize this response into Rust code. Back in our `handlers.rs`
file:

```rust
// Imports...

#[derive(Serialize, Debug)]
pub struct StarsResponse {
    count: usize,
}

#[derive(Deserialize, Debug)]
pub struct GitHubRepositoryResponse {
    stargazers_count: usize
}

pub async fn get_repository_stars(
    State(state): State<Arc<HandlerState>>,
    Path(repository): Path<String>,
) -> Result<Json<StarsResponse>, ApiError> {
    // Code...
}
```

We've added a `GithubRepositoryResponse` to handle pulling data out into a `struct`. Let's implement the call now in our
handler:

```rust
pub async fn get_repository_stars(
    State(state): State<Arc<HandlerState>>,
    Path(repository): Path<String>,
) -> Result<Json<StarsResponse>, ApiError> {
    tracing::info!(
        "Received request to get start count for repository {}",
        repository
    );

    let url = format!("https://api.github.com/repos/joeymckenzie/{}", repository);

    let response = state
        .client
        .get(url)
        .bearer_auth(state.access_token)
        .send()
        .await?;

    let response = StarsResponse { count: 9000 };

    Ok(Json(response))
}
```

Now if try to compile, we'll get an error yelling at us stating we have no conversion between a `reqwest` error and
something axum understands with our `ApiError`. Yep, you guessed it - time to do some error converting.

## Propagating errors

One of the first fundamental concepts we learn in Rust is the proper handling and conversion of errors. With Rust's
expansive crate ecosystem and library authors offering custom errors about their internal processes in their public
APIs, we're bound to eventually be forced to convert external errors to something that's known within our programs.
There are many great articles, including [the book itself](https://doc.rust-lang.org/stable/book/), that do a much more
fantastic job than I'll do here going over converting errors from (in our case) `reqwest` to our internal `ApiError`.

In the simplest case, we'll need to convert `From` a `reqwest::Error` to an `ApiError`:

### errors.rs

```rust
pub enum ApiError {
    RequestFailed(String),
}

impl From<reqwest::Error> for ApiError {
    fn from(value: reqwest::Error) -> Self {
        Self::RequestFailed(value.to_string())
    }
}
```

We could do this for any number of errors that will rear their ugly heads at some point while our function is executing,
but for now, I'll take the easy way out with [`thiserror`](https://crates.io/crates/thiserror):

```shell
cargo add thiserror
```

Now we can trim up `errors.rs`:

```rust
use axum::{response::IntoResponse, Json};
use http::StatusCode;
use serde::Serialize;
use thiserror::Error;

#[derive(Serialize, Debug)]
struct HandlerError {
    message: String,
}

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("The request to GitHub failed: {0}")]
    RequestFailed(#[from] reqwest::Error),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let (status, error_message) = match self {
            Self::RequestFailed(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
        };

        let body = Json(HandlerError {
            message: error_message,
        });

        (status, body).into_response()
    }
}
```

Leaning on `thiserror`, we can leverage the `#[error]` macro to spit out a bit of boilerplate error conversion code for
us. For a sanity check, let's take a look at the generated code with another quick `cargo expand errors`:

```rust
pub enum ApiError {
    #[error("The request to GitHub failed")]
    RequestFailed(#[from] reqwest::Error),
}

#[allow(unused_qualifications)]
impl std::error::Error for ApiError {
    fn source(&self) -> std::option::Option<&(dyn std::error::Error + 'static)> {
        use thiserror::__private::AsDynError;
        #[allow(deprecated)]
        match self {
            ApiError::RequestFailed { 0: source, .. } => {
                std::option::Option::Some(source.as_dyn_error())
            }
        }
    }
}

#[allow(unused_qualifications)]
impl std::fmt::Display for ApiError {
    fn fmt(&self, __formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
        #[allow(unused_variables, deprecated, clippy::used_underscore_binding)]
        match self {
            ApiError::RequestFailed(_0) => {
                __formatter.write_fmt(format_args!("The request to GitHub failed"))
            }
        }
    }
}

#[allow(unused_qualifications)]
impl std::convert::From<reqwest::Error> for ApiError {
    #[allow(deprecated)]
    fn from(source: reqwest::Error) -> Self {
        ApiError::RequestFailed {
            0: source,
        }
    }
}

#[automatically_derived]
impl ::core::fmt::Debug for ApiError {
    fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
        match self {
            ApiError::RequestFailed(__self_0) => {
                ::core::fmt::Formatter::debug_tuple_field1_finish(
                    f,
                    "RequestFailed",
                    &__self_0,
                )
            }
        }
    }
}
```

Sifting through the other bits of code that are printed out to the console, we see that `thiserror` is generating some
boilerplate to `impl` `std::error::Error` and `From<reqwest::Error>` for us, so we can avoid writing the implementations
ourselves. Thanks, [dtolnay](https://crates.io/users/dtolnay)!

## So many stars

Okay, back to our handler. So we're handling the result errors `reqwest` _could_ propagate back to us, now let's rip
the `stargazer_count` off the API response to map back to our `StarsResponse` struct. Let's throw a `.json()` after
our `.await?` to do so:

```rust
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
        .bearer_auth(&state.access_token)
        .header("User-Agent", "github-repository-star-counter/0.0.1")
        .send()
        .await?
        .json::<GitHubRepositoryResponse>()
        .await?;

    let response = StarsResponse {
        count: github_response.stargazers_count,
    };

    Ok(Json(response))
}
```

We'll attempt to deserialize the response into our `GitHubRepositoryResponse` and again `await?` the process as we need
to read from the response buffer and propagate any errors. We're already converting between `reqwest` errors and our
internal `ApiError`, so we're all good there.

We also add a `User-Agent` header to let the GitHub API servers know who we are - this is arbitrary for our purposes,
but is important for requests coming from the browser, in Postman, etc. Let's spin up our function and send a request
through:

```shell
 curl -l http://localhost:8000/realworld-rust-axum-sqlx/stars
{"count":129}
```

We have a response! Now that we've got the core logic in place, let's go ahead and deploy our function
with `cargo shuttle deploy`. Once the deployment finishes, let's ping our function at the deployment URL:

```shell
curl -l https://github-repository-star-counter.shuttleapp.rs/realworld-rust-axum-sqlx/stars
{"count":129}
```

Nice! We've got good responses coming back from a serverless function written entirely in Rust. Let's check the logs
with a quick `cargo shuttle logs` to trace our request:

```shell
cargo shuttle logs
# A few other logs that aren't important for now...
 INFO serverless_rust_with_shuttle::handlers: Received request to get start count for repository realworld-rust-axum-sqlx
DEBUG reqwest::connect: starting new connection: https://api.github.com/
DEBUG hyper::client::connect::dns: resolving host="api.github.com"
DEBUG hyper::client::connect::http: connecting to 140.82.121.6:443
 INFO serverless_rust_with_shuttle::handlers: Response received from GitHub GitHubRepositoryResponse { stargazers_count: 129 }
DEBUG hyper::proto::h1::io: flushed 121 bytes
```

## Wrapping up

And that's a wrap! We've got Rust running out in the wild in the form of a serverless function and I couldn't be
happier. There's quite a bit of cleanup we could do, for instance handling cases where the repository doesn't exist, but
I'll leave that as an exercise for the reader.

All the source code for this function can be on my
GitHub [here](https://github.com/JoeyMckenzie/joey-mckenzie-tech/samples/rust/with-shuttle).

Until next, friends!
