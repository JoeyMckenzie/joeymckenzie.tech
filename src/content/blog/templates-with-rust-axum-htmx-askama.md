---
title: 'Going static with Rust, axum, and htmx'
description: 'Just because we can SSR does not mean we should'
pubDate: 'June 15 2023'
heroImage: '/blog/rust-axum-htmx-templates-with-askama/htmx_meme.jpg'
category: 'rust'
published: false
---

Back from paternity, I had quite a blast messing around with a few Rust libraries in an attempt
to build a website (web app?) going back to basics. I'm somewhat JS'd out as of late and was looking
for some way to integrate [htmx](https://htmx.org/) with templates in a similar vein to Go's [html templates](https://pkg.go.dev/html/template/).
I was pleasantly surprised at how easily I was able to duct tape [axum's](https://github.com/tokio-rs/axum/) static file serving using
[askama's](https://github.com/djc/askama/) as a templating engine of sorts.

Coupled with htmx and [Tailwind](https://tailwindcss.com/), I was able to find a workflow for site building using the tools I wanted, with
the best part being _entirely_ JS-free. I should preface this as **not** an advertisement for JS's demise, but simply an alternative approach to the development of Rust-backed web apps.

## The stack

To kick things off, let's run through the bits we'll utilize to build a relatively straightforward application that serves
static HTML but with reactivity powered by htmx. Our sandbox will look something like:

- Rust (for obvious reasons)
- Axum for serving static assets and powering the backend API
- Askama for HTML templating - think shared layouts, scripts, CSS, etc.
- htmx for reactivity on the UI
- Tailwind, because my brain is too smooth now to do CSS myself
- (Bonus) Docker and [Fly](https://fly.io/) for deployment and hosting

RAAHT-stack? THARA? Not sure, gonna need to workshop the acronym a bit.

## Getting started

Let's start by spinning up a new Rust binary:

```bash
$ cargo new --bin with-axum-htmx-askama && cd with-axum-htmx-askama
     Created binary (application) `with-axum-htmx-askama` package
```

Next, let's bring in the stuff we'll need to start building,

```bash
$ cargo add askama # our templating engine
$ cargo add axum # our web/file server
$ cargo add tokio --features full # async runtime
# let's add tracing for sanity
$ cargo add tracing
$ cargo add tracing-subscriber --features env-filter
# finally, let's add tower to utilize the file serving capabilities
$ cargo add tower
$ cargo add tower-http --features fs
```

Okay, got our dependencies installed, now let's scaffold out `main.rs` with a basic router and tracing setup:

```rust
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "with_axum_htmx_askama=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("hello, web server!");
}
```

And running a quick sanity check:

```bash
$ cargo run
# things compiling...
2023-06-13T06:21:03.461354Z  INFO with_axum_htmx_askama: hello, web server!
```

Sweet, we're up and running with logging! Before we jump into our router, we should probably figure out _what_ exactly we'll be serving.
For our templates, we'll tap into askama to help axum route endpoints to serve static HTML. Askama defaults to looking for templates
in a `/templates` directory at the, let's add that now with a bit of markup:

## templates/hello.html

```html
<h1>
  Howdy!
  <h1></h1>
</h1>
```

Back in `main.rs`, let's add an axum route to serve this file:

```rust
use anyhow::Context;
use askama::Template;
use axum::{
    http::StatusCode,
    response::{Html, IntoResponse, Response},
    routing::get,
    Router,
};
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "with_axum_htmx_askama=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("initializing router...");

    let router = Router::new().route("/", get(hello));
    let port = std::env::var("PORT")
        .context("port was not found in the current environment")?
        .parse::<u16>()
        .context("port is invalid")?;
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));

    info!("router initialized, now listening on port {}", port);

    axum::Server::bind(&addr)
        .serve(router.into_make_service())
        .await
        .context("error while starting server")?;

    Ok(())
}

async fn hello() -> impl IntoResponse {
    let template = HelloTemplate {};
    HtmlTemplate(template)
}

#[derive(Template)]
#[template(path = "hello.html")]
struct HelloTemplate;

/// A wrapper type that we'll use to encapsulate HTML parsed by askama into valid HTML for axum to serve.
struct HtmlTemplate<T>(T);

/// Allows us to convert Askama HTML templates into valid HTML for axum to serve in the response.
impl<T> IntoResponse for HtmlTemplate<T>
where
    T: Template,
{
    fn into_response(self) -> Response {
        // Attempt to render the template with askama
        match self.0.render() {
            // If we're able to successfully parse and aggregate the template, serve it
            Ok(html) => Html(html).into_response(),
            // If we're not, return an error or some bit of fallback HTML
            Err(err) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to render template. Error: {}", err),
            )
                .into_response(),
        }
    }
}
```

Okay, so we fleshed out our router quite a bit and added a few types to help us serve
the HTML askama will generate for us (more on that in a bit).

We have a simple base route that serves the `hello.html` file we have in our `templates/` directory,
though askama is also able to pass render-able data to these HTML files in a template-like fashion.
Luckily for us, askama provides the `#[template(path = "path/to/html")]` macro, assuming your HTML
files are in the `templates/` directory. Luckily this is configurable, but the defaults will do for now.

We'll also pass in a `PORT` environment variable that will help us control what ports we serve over
for local development as well as within our Docker container, and eventually when deployed to Fly. I've
also added [anyhow](https://docs.rs/anyhow/latest/anyhow/) as a dependency to make error handling a bit
more convenient.

Now if we spin this up passing in a `PORT`:

```bash
$ PORT=8000 cargo run
    # stuff compiling...
2023-06-13T06:47:23.018937Z  INFO with_axum_htmx_askama: initializing router...
2023-06-13T06:47:23.019361Z  INFO with_axum_htmx_askama: router initialized, now listening on port 8000
```

We have some basic logs that reassure successful startup, and if we navigate to `localhost:8000` in our favorite browser:

![landing page](/blog/rust-axum-htmx-templates-with-askama/landing_page.png)

We've got ourselves a landing page!

## Integrating Tailwind

Now, this isn't the most _exciting_ landing page, let's spruce this up a bit to make it look like it's not from 1996.
I'm gonna be using [Tailwind](https://tailwindcss.com/) mostly because I'm a CSS sellout and love really, really, really long
class names on my attributes.

Tailwind helpfully provides a plethora of integration guides for any number of tech stacks. Unfortunately, Rust-based static
file serving with axum isn't on the list. The good news, however, is that we can rely on the most basic of Tailwind strategies
to bring in some sweet styles.

If you're not familiar with Tailwind, take a look at the docs and the philosophy behind its design system. There are some pretty
neat optimizations we'll tap into, and one of the reasons I love Tailwind is for the [utility tree-shaking/minification](https://tailwindcss.com/docs/optimizing-for-production) of CSS
that it'll do to ensure our bundled styles are as small as possible. No one needs 70 MB of CSS shipped to their browser.

We're going to rely on a few npm packages, so we'll need to spin up a simple `package.json` file to help us bring in Tailwind and eventually Prettier to make things look nice on our templates. Using pnpm:

```bash
$ pnpm init
Wrote to ~/with-axum-htmx-askama/package.json

{
  "name": "with-axum-htmx-askama",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

With our package manifest in place, let's add a few things to it. I'm using pnpm, feel free to use npm or yarn:

```bash
pnpm add -D tailwindcss prettier prettier-plugin-tailwindcss
```

And let's clean up `package.json` to remove the things we won't need:

```json
{
  "name": "with-axum-htmx-askama",
  "version": "1.0.0",
  "license": "ISC",
  "devDependencies": {
    "prettier": "^2.8.8",
    "prettier-plugin-tailwindcss": "^0.3.0",
    "tailwindcss": "^3.3.2"
  }
}
```

I'm using Prettier to keep things nicely formatted, so I'll add a quick script to keep our templates tidy:

```json
{
  "name": "with-axum-htmx-askama",
  "version": "1.0.0",
  "license": "ISC",
  "scripts": {
    "format": "prettier --write --ignore-unknown ."
  },
  "devDependencies": {
    "prettier": "^2.8.8",
    "prettier-plugin-tailwindcss": "^0.3.0",
    "tailwindcss": "^3.3.2"
  }
}
```

Now we can format from the terminal to our heart's content:

```bash
$ pnpm format

package.json 340ms
pnpm-lock.yaml 159ms
templates/hello.html 371ms
```

Let's spice up our template now. Back in `hello.html`, let's flesh this page out a bit more
to be more of a fully functional HTML file we'd expect to serve to the browser, including assets:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link href="/assets/main.css" rel="stylesheet" />
    <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
  </head>
  <body>
    <h1>Howdy!</h1>
  </body>
</html>
```

I've added two `link`s to CSS files, one for the Inter font... because why not.

![inter meme](/blog/rust-axum-htmx-templates-with-askama/inter_meme.jpg)

Okay, so we have
