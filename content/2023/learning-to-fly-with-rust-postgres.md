---
title: 'Learning to fly with Rust and Postgres'
description: 'If it can be Dockerized, it can be deployed.'
pubDate: 'Apr 05 2023'
heroImage: '/images/learning-to-fly-rust-postgres/fly_meme.jpg'
category: 'rust'
keywords:
  - rust
  - postgres
  - fly.io
---

After a long weekend of random life events, I decided I needed to scratch an itch to learn something new. I've been
writing a lot serverless [Lambda's](https://aws.amazon.com/lambda/) lately and wanted to jump back into a more managed
workflow with a new tool I have yet to use, though seems to be getting a lot of hype in [fly.io](https://fly.io/). I've
been hearing quite a bit within the community about the love developers have for fly due to its ease of deployment and
ideology about app servers centralizing on the idea of simply just deploying projects based on a Dockerfile. I do my
fair share of Docker management at work and on side projects, so why not take fly for a spin?

## Getting started with Fly

Fly seems like the perfect approach to get app servers up and running quickly. Simply spin up a project in a
language/framework of your choice, write a sensible Dockerfile fit for running on a server, and deploy to fly's platform
to just have things _work_. Most of my workflow nowadays involves maintaining servers and applications through a variety
of different tools, though mainly AWS stuff. I've been looking for a reason to de-AWS my side projects and found this
the perfect opportunity to do so by deploying a mighty simple Rust app sitting atop a Postgres database.

Luckily enough, fly offers a hosted [Postgres option](https://fly.io/docs/postgres/) that is just another fly app within
our cluster that our other fly app servers can talk to. Fly makes it clear, though, that this is not
a [fully managed database solution](https://fly.io/docs/postgres/getting-started/what-you-should-know/), as opposed to
something like [PlanetScale](https://planetscale.com/), so your mileage may vary if you're looking to maintain a
database without being expected to put on a DBA hat now and again.

To get up and running, fly offers a rather nice [CLI](https://fly.io/docs/hands-on/install-flyctl/) to help manage our
app servers and account. Let's start by installing it on our local machine. I'll be using brew with WSL2, so a quick:

```shell
> brew install flyctl
```

should do the trick. Now that we've got the CLI installed, go ahead and log in with `fly auth login` and follow the
login prompts in the browser the CLI opens. Once we've authenticated, we should be good to start spinning up some apps.

## Creating a Postgres instance

Since we'll be building a simple web app with a bit of persistence, let's go ahead and spin up our Postgres instance:

```shell
> fly postgres create
```

Follow the prompts, naming your database whatever seems appropriate and choosing the development configuration as we
don't necessarily need high availability for a toy project. After fly does a bit of initialization, we should see
something like:

```shell
Postgres cluster wandering-cloud-1281 created
  Username:    postgres
  Password:    {{password}}
  Hostname:    {{hostname}}
  Flycast:     {{flycast}}
  Proxy port:  5432
  Postgres port:  5433
  Connection string: postgres://postgres:{{password}}@{{server}}:5432

Save your credentials in a secure place -- you won't be able to see them again!
```

in the console. Let's verify we're able to connect. As of this writing, there's a bit more configuration
needed [connect to your instance externally](https://fly.io/docs/postgres/connecting/connecting-external/) through a
client like pgAdmin, but luckily `flyctl` has us covered allowing us to connect to our internal instance through the
CLI. Let's connect and verify we can run some queries:

```shell
> fly postgres connect -a <your instance name>
Connecting to <ip>... complete
psql (15.2 (Debian 15.2-1.pgdg110+1))
Type "help" for help.

> postgres=# \dt *.*
                           List of relations
       Schema       |           Name           |    Type     |  Owner
--------------------+--------------------------+-------------+----------
 information_schema | sql_features             | table       | postgres
 information_schema | sql_implementation_info  | table       | postgres
 information_schema | sql_parts                | table       | postgres
 information_schema | sql_sizing               | table       | postgres
 pg_catalog         | pg_aggregate             | table       | postgres
 pg_catalog         | pg_am                    | table       | postgres
 pg_catalog         | pg_amop                  | table       | postgres
```

Running a quick `\dt *.*`. We should see a list of tables with various bits of metadata about their schema, type, owner,
and name. Sweet!

## Bootstrapping our service

Next, let's spin up a bare-bones Rust web app. I'll be using [axum](https://docs.rs/axum/latest/axum/) as my framework,
but feel free to use your own:

```shell
> cargo new flying-with-rust-and-postgres
# and once cargo is done with it's thing, let's add axum
> cargo add axum
# and while we're at it, let's grab tokio too
> cargo add tokio --features full
```

Now that we've got our project bootstrapped, let's crack open `main.rs` and scaffold out a simple route:

```rust
use std::net::SocketAddr;

use axum::{routing::get, Router};

async fn howdy() -> &'static str {
    "Well, hello there partner!"
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Require a port to run, we can configure this with fly
    let port = std::env::var("PORT")?
        .parse::<u16>()
        .expect("port is not valid");

    let router = Router::new().route("/howdy", get(howdy));

    // Bind to whatever the hosting interface is - localhost on our dev machine, fly's domain once deployed
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    axum::Server::bind(&addr)
        .serve(router.into_make_service())
        .await
        .unwrap();

    Ok(())
}

```

Let's spin this thing up to make sure we've got water flowing through the pipes, so to speak:

```shell
> PORT=8080 cargo run

# in another terminal...
> curl -l http://localhost:8080/howdy
Well, hello there partner!
```

Nice! We've got the (arguably) world's most simple API ready to roll, now let's get this thing into fly.

## Dockerizing our app

I'll be the first to admit I'm _far_ from an experience Docker aficionado - most of my daily Docker work is within the
.NET realm. With that said, since all fly needs is a Dockerfile to get started, let's add one to the root of our project
with a simple configuration, doing what we can to compress the size here and there:

```shell
# All credit goes to https://fasterthanli.me/articles/remote-development-with-rust-on-fly-io#what-the-heck-is-fly-io-for-even
# for an an awesome walkthrough of Dockerfiles for rust, this is more or less a direct copy pasta with a few minor tweaks

# After containerization, this manages to come in at a whopping ~155mb, still a bit to we could optimize but this should do for now

# Stage one - copy over our build files for compilation, including workspace and .env files
FROM rust:1-slim-bullseye AS build

WORKDIR /app

COPY . .

# On rebuilds, we explicitly cache our rust build dependencies to speed things up
RUN --mount=type=cache,target=/app/target \
    --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/usr/local/rustup \
    set -eux; \
    # We'll use nightly because we like to go fast and break things
    rustup install nightly; \
    cargo build --release; \
    # Compress debug symbols, squeezing the size just a bit more
    objcopy --compress-debug-sections target/release/flying-with-rust-and-postgres ./server

# Stage two - we'll utilize a second container to run our built binary from our first container - slim containers!
FROM debian:bullseye-slim as deploy.sh

# Let's install all the necessary runtime tools on the container
RUN set -eux; \
    export DEBIAN_FRONTEND=noninteractive; \
    apt update; \
    apt install -y --no-install-recommends bind9-dnsutils iputils-ping iproute2 curl ca-certificates htop; \
    apt clean autoclean; \
    apt autoremove -y; \
    rm -rf /var/lib/{apt,dpkg,cache,log}/;

# Let's work from a self contained directory for all of our deployment needs
WORKDIR /deploy.sh

# We need the artifact from the build container, so let's grab it
COPY --from=build /app/server ./

# Let's expose port 80 as we'll need fly's internal port mapping also assumes 80
EXPOSE 80

# Finally, boot up the API
CMD ["./server"]
```

With our Dockerfile in place, let's build this bad boy:

```shell
> docker build . -t flying_with_rust_and_postgres
```

After a lengthy initial build (successive builds will be quicker thanks to the bits of caching we threw in there), we
can spin up our container locally and verify we're still looking good from a server perspective:

```shell
> docker run -d \
    -p 8080:8080 \ # expose the container's port to match what our axum server will listen under
    -e PORT=8008 \ # the required env var to configure our axum port
    --name flying_with_rust_and_postgres \ # gives this container a name to stop and start
    -it flying_with_rust_and_postgres # tags this container
```

After a few seconds, we should the container ID spit out in the terminal, and if we send through another request:

```shell
> curl -l http://localhost:8080/howdy
Well, hello there partner!
```

Our app is running in a containerized manner, now let's get this thing deployed!

## Deploying to fly

Alright, I _did_ mention I was using this post as an excuse to learn fly, so let's figure out what the deployment story
looks like. There's gotta be _something_ in the CLI, right? Let's do a bit of trial and error:

```shell
> fly
This is flyctl, the Fly.io command line interface.

Here's a few commands to get you started:
  fly launch      Launch a new application
  fly apps        Create and manage apps
  fly postgres    Create and manage Postgres databases
  fly redis       Create and manage Redis databases
  fly machines    Create and manage individual Fly.io machines

If you need help along the way:
  fly help            Display a complete list of commands
  fly help <command>  Display help for a specific command, e.g. 'fly help launch'

Visit https://fly.io/docs for additional documentation & guides
```

Okay... `fly launch` looks promising, let's check it out:

```shell
> fly help launch
Create and configure a new app from source code or a Docker image.

Usage:
  flyctl launch [flags]

Flags:
      # ...a bunch of options and whatnot
```

Alright, this looks like _exactly_ what we need. We have a Dockerfile, and all we need is to put this thing on a fly app
server. Let's take it for a spin:

```shell
> fly launch
```

We get asked a bunch of questions, like what we want the app named, where it should be located, etc. Fly asks if we want
a Postgres instance - let's decline that for now as we have already one in place. What's even neater is that fly
generates a config file for us in the `fly.toml` file that now appears in our editor:

```toml
# fly.toml file generated for flying-with-rust-and-postgres on 2023-04-03T14:09:56-07:00

app = "flying-with-rust-and-postgres"
kill_signal = "SIGINT"
kill_timeout = 5
primary_region = "lax"
processes = []

[env]

[experimental]
auto_rollback = true

[[services]]
http_checks = []
internal_port = 80
processes = ["app"]
protocol = "tcp"
script_checks = []
[services.concurrency]
hard_limit = 25
soft_limit = 20
type = "connections"

[[services.ports]]
force_https = true
handlers = ["http"]
port = 80

[[services.ports]]
handlers = ["tls", "http"]
port = 443

[[services.tcp_checks]]
grace_period = "1s"
interval = "15s"
restart_limit = 0
timeout = "2s"
```

We wait a bit, and check the console as we sit on the edge of our seats in anticipation of a successful deployment,
and... it failed. Well, shoot. Let's take a look at the logs:

```shell
> fly logs

# ...after a bit of sifting, we see something familiar
[info]Preparing to run: `./server` as root
[info]Error: NotPresent
```

An error at startup? Oh! We didn't pass a port environment variable, so let's add that to our fly config:

```toml
# other configs...
[env]
PORT = "80"
```

For production, we want to listen on port 80 as the default API port (versus 8080 locally). While we're at it, let's
also expose port 443 in our Dockerfile to satisfy SSL:

```dockerfile
# Previous setup...

# Let's expose port 80 as we'll need fly's internal port mapping also assumes 80
EXPOSE 80
EXPOSE 443

# Finally, boot up the API
CMD ["./server"]
```

Okay, the second time's a charm:

```shell
> fly deploy.sh
```

And after a few seconds (thanks to our layer caching), we should see a message about our app being deployed
successfully! A quick `fly logs` confirms it with a bunch of green in the terminal, but let's do a quick sanity check:

```shell
> curl -l https://flying-with-rust-and-postgres.fly.dev/howdy
Well, hello there partner!
```

Nice! Now anytime we make changes, we can `fly deploy` to have the reflected on our production. In reality, we'd hook
this up to CI, but I'll leave that as an exercise for the reader.

## Task-ifying local development

Now with the hard part out of the way, let's get back to the code. Because we'll be iterating, building docker
containers, deploying, etc. _and_ because I can never remember all the docker flags I need to pass when
building/running/starting/stopping containers _and_ because I'm lazy, I'm going to add a `Makefile` (pause for audible
gasp). There are better alternatives for Rust projects like [`cargo-make`](https://github.com/sagiegurari/cargo-make),
but our use case is simple enough here as we only need to manage docker. Let's add one to the root of our project:

```shell
PORT = 8080
TAG = flying_with_rust_and_postgres

.PHONY: build
build:
    docker build . -t $(TAG)

.PHONY: run
run:
    docker run -d \
    -p $(PORT):$(PORT) \
    -e PORT=$(PORT) \
    --name $(TAG) \
    -it $(TAG)

.PHONY: stop
stop:
    docker stop $(TAG)

.PHONY: start
start:
    docker start $(TAG)
```

Now, with a simple `make build` or `make run`, we can rebuild and restart our container a bit easier. I'm using `PHONY`
targets here, as I'm using `make` as a glorified task runner rather than building outputs.

Okay, so back to where we left off. We want to explore integrating fly apps with Postgres, but only our _deployed_ fly
apps can talk to our Postgres instance, which is a good thing - I don't want to do local development against production
data. Let's spin up a local development database with Postgres using docker by adding a few tasks to our `Makefile`:

```shell
DB_PORT = 5432

# Other tasks...

.PHONY: db-run
db-run:
    docker run -d \
     -p $(DB_PORT):$(DB_PORT) \
     -e POSTGRES_PASSWORD=mySuperSecretPassword! \
     --name fly_demo_db \
     postgres

.PHONY: db-start
db-start:
    docker start fly_demo_db

.PHONY: db-stop
db-stop:
    docker stop fly_demo_db
```

Now we can spin up a local development database with a simple `make db-run`and subsequently,`make db-start`
and `make db-stop` to start/stop it when needed. I should note that I'm only using `make` here to facilitate docker
tasks as there are a handful of flags, local variables, and whatnot. `cargo` and `fly` are simple enough commands that
we don't necessarily need to add task runners for them.

## Where we're going... we'll need persistence

So we're going to talk to a database from our Rust code. There are _quite_ a few great crates to facilitate doing this,
and purely out of selfish preference, I'm going to use [`sqlx`](https://crates.io/crates/sqlx). `sqlx` is simple,
straightforward, compile-time safe, and at the end of the day, it's just SQL. This isn't a post about sqlx - we'll save
that for a rainy day.

With that schpiel out of the way, let's add sqlx with the `runtime-tokio-rustls` and `migrate` features along
with `postgres`:

```shell
> cargo add sqlx --features runtime-tokio-rustls, migrate, postgres
```

Specifically, `migrate` will allow us to use migrations to keep our local development database in sync with our
production database, as again, only our fly apps can actually communicate with our Postgres instance (if you're
unwilling to pay). To make our migration story even easier, let's add
the [`sqlx-cli`](https://crates.io/crates/sqlx-cli) to help us manage migrations.

```shell
# We're only using Postgres, so we need just a subset of all features
> cargo install sqlx-cli --no-default-features --features rustls, postgres
```

After it's installed, let's add a `.env` file that the sqlx CLI will look for when running and applying migrations:

### .env

```shell
DATABASE_URL=postgres://postgres:mySuperSecretPassword@localhost:5432/postgres?sslmode=disable
```

We'll slap a `sslmode=disable` here since we're only using this connection string locally. When we deploy, we'll need to
override this in our fly configuration at some point. Now that we've got the sqlx CLI installed, let's spin up a fresh
migration.

To spice things up a bit, rather than your standard issue `todo` example, let's create a `beer_logs` table to track
journal entries of amazing beers we've drunk (somehow, that seems much more grammatically worse than "drank"):

```shell
> sqlx migrate add add_beer_logs_table

Creating migrations/20230403232851_add_beer_logs_table.sql

Congratulations on creating your first migration!

Did you know you can embed your migrations in your application binary?
On startup, after creating your database connection or pool, add:

sqlx::migrate!().run(<&your_pool OR &mut your_connection>).await?;

Note that the compiler won't pick up new migrations if no Rust source files have changed.
You can create a Cargo build script to work around this with `sqlx migrate build-script`.

See: https://docs.rs/sqlx/0.5/sqlx/macro.migrate.html
```

Nice! We've got a `/migrations` folder added, let's add some SQL to the script:

```sql
-- Add migration script here
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE beer_logs
(
    id    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name  TEXT NOT NULL,
    notes TEXT NOT NULL,
);
```

I'm using `UUID`s instead of integer-based for a variety of reasons, and whose discussion is out of scope for our
purposes, atop the fact that people much smarter than myself can reason about doing so better than I can. Since we'll be
using UUIDs for keys, we'll need to add `uuid` as a sqlx feature in our manifest file. Now that we've fleshed out our
migration, let's apply it:

```shell
> sqlx migrate run
Applied 20230403232851/migrate add beer logs table (71.391042ms)
```

Sweet! If we inspect the database using your tool of choice, we should see two tables:

- `_sqlx_migrations` - the migration management table
- `beer_logs` - the journal table we created

We're going to need the same schema applied to our production database, so let's add a bit of code to apply migrations
programmatically when our application starts up. Back in `main.rs`:

```rust
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

    println!("Migrations successfully applied!");

    let router = Router::new().route("/howdy", get(howdy));

    // Bind to whatever the hosting interface is - localhost on our dev machine, fly's domain once deployed
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    axum::Server::bind(&addr)
        .serve(router.into_make_service())
        .await
        .unwrap();

    Ok(())
}
```

We've added a few lines to import a `DATABASE_URL` environment variable and run migrations, with the default being
migrations mapped to whatever is underneath the `/migrations` folder. We've also sprinkled in a few `println!()`s as a
poor man's version of [tracing](https://crates.io/crates/tracing), but for our purposes here will suffice. If we spin up
our server now with `cargo run`, we should see a relatively boring console as our migrations have already been manually
applied using the CLI:

```
> PORT=8080 postgres://postgres:mySuperSecretPassword!@localhost:5432/postgres?sslmode=disable cargo run

Finished dev [unoptimized + debuginfo] target(s) in 0.12s
 Running `target/debug/flying-with-rust-and-postgres`
Running migrations...
Migrations successfully applied!
```

To sanity check, if we drop the tables (using your DB interface of choice) and spin up the server, we should see the
success message again. Now, it's going to be a bit annoying to have to punch in our environment variables, so let's add
a `make` task:

```makefile
# Existing environment variables...
CONNECTION_STRING = postgres://postgres:mySuperSecretPassword!@localhost:5432/postgres?sslmode=disable

.PHONY: run-server
run-server:
 PORT=$(PORT) DATABASE_URL=$(CONNECTION_STRING) cargo run
```

We could also use [`dotenvy`](https://crates.io/crates/dotenvy), though we only have a couple variables to manage for
now. Starting up with a `make run-server` does the trick:

```shell
> make run-server

PORT=8080 DATABASE_URL=postgres://postgres:mySuperSecretPassword!@localhost:5432/postgres?sslmode=disable cargo run
   Compiling flying-with-rust-and-postgres v0.1.0 (~/flying-with-rust-and-postgres)
    Finished dev [unoptimized + debuginfo] target(s) in 5.51s
     Running `target/debug/flying-with-rust-and-postgres`
Initializing connection pool...
Connection pool initialized, running migrations...
Migrations successfully applied!
```

## Keeping schema in sync

Since we've created a table in development, let's do the work to get our production database on fly in the same state.
Since our production database is hosted on fly, we need to adjust the `DATABASE_URL` application expects. Let's update
that within our `fly.toml` configuration:

```toml
[env]
PORT = "80"
DATABASE_URL = "postgres://postgres:<your password@<your host>:5432/postgres?sslmode=disable"
```

Again, I'm disabling SSL because I'm ~~cheap~~ not holding possession of a valid cert to secure connections between my
app server and the database. Obviously, DO NOT do this in a production scenario - for our purposes, simply serving over
insecure ports will do.

Now, if we deploy our application with a `fly deploy`, we should see some good logs:

```shell
> fly deploy.sh

# A bunch of other logs...
[info]Initializing connection pool...
[info]Connection pool initialized, running migrations...
[info]Migrations successfully applied!
[info]Health check on port 80 is now passing.
[info]Shutting down virtual machine
[info]Sending signal SIGINT to main child process w/ PID 520
[info]Starting clean up.
[info]Shutting down virtual machine
[info]Sending signal SIGINT to main child process w/ PID 520
[info]Starting clean up.
```

Key to note here are the simple logs we output for migrations and clean server start. We're all set to now FINALLY write
some application code!

## Logging beers

We set out to create a simple journal application to log the fantastic beers we've had so far. Let's add a route to
create journals in `main.rs`:

```rust
#[derive(Deserialize, Debug)]
struct LogBeerRequest {
    pub name: String,
    pub notes: String,
}

#[derive(Serialize)]
struct LogBeerResponse {
    pub id: Uuid,
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
```

Our log handler will simply take input, dump data into the `beer_logs` table, and return the ID of the created row. Now,
we're _obviously_ glossing over a few things here like proper error and response handling, injecting persistence
concerns at the API surface, etc. but we'll save those discussions for another day.

We're also using sqlx's `Uuid` type, so we'll need to add it as a `feature` to our dependencies, along with the `uuid`
package so we can reliably serialize the UUID type for requests and responses.

We're passing in some [axum `State`](https://docs.rs/axum/latest/axum/#sharing-state-with-handlers) with our
internal `AppState`, which we'll use to wrap our database connection pool in a safe manner:

```rust
struct AppState {
    pool: PgPool,
}

// And updating `main.rs`...
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Previous setup...

    // Create a bit of state to share the connection pool and spint up the router
    let state = AppState { pool };
    let router = Router::new()
        .route("/howdy", get(howdy))
        .route("/logs", post(create_log))
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
```

Now if we rebuild and spin up our server and send a request through:

```shell
> make run-server

PORT=8080 DATABASE_URL=postgres://postgres:mySuperSecretPassword!@localhost:5432/postgres?sslmode=disable cargo run
   Compiling flying-with-rust-and-postgres v0.1.0 (/home/jmckenzie/projects/rust/joey-mckenzie-tech/samples/flying-with-rust-and-postgres)
    Finished dev [unoptimized + debuginfo] target(s) in 6.23s
     Running `target/debug/flying-with-rust-and-postgres`
Initializing connection pool...
Connection pool initialized, running migrations...
Migrations successfully applied! Initializing router...
Router initialized, now listening on port 8080

# In another terminal...
> curl --header "Content-Type: application/json" \
--request POST \
--data '{"name":"Pliny the Elder","notes":"Like drinking the nectar of the gods..."}' \
http://localhost:8080/logs

{"id":"06845f6d-2647-4312-9753-a89ed61cd792"}

# And back in our server logs...
Received request to create beer log LogBeerRequest { name: "Pliny the Elder", notes: "Like drinking the nectar of the gods..." }
```

We've got a response! While we could manually verify the row was inserted with some queries, let's add an endpoint to
retrieve rows when given an ID:

```rust
async fn get_log(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Json<LogBeerRequest> {
    println!("Received request to retrieve beer log {}", id);

    let result = query_as!(
        LogBeerRequest,
        r"
        SELECT id, name, notes FROM beer_logs
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
```

And now let's update `main.rs` to add a route to handle retrieving logs:

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Previous setup...

    // Create a bit of state to share the connection pool and spint up the router
    let state = AppState { pool };
    let router = Router::new()
        .route("/howdy", get(howdy))
        .route("/logs", post(create_log))
        .route("/logs/:id", get(get_log))
        .with_state(Arc::new(state));

    // Other stuff...
}
```

Now if we bounce our server and send a request through using the previously created log:

```shell
> curl -l http://localhost:8080/logs/06845f6d-2647-4312-9753-a89ed61cd792

{"id":"06845f6d-2647-4312-9753-a89ed61cd792","name":"Pliny the Elder","notes":"Like drinking the nectar of the gods..."}
```

We've got logs! Again, we're cutting a few corners here that we would most definitely want to handle in a more
real-world scenario, but for now, we've got a pretty good-looking (though bare-bones) beer-logging journal API. Let's
get this thing deployed!

## Back to fly

Our fully fleshed-out server should look something like:

```rust
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

    sqlx::migrate!("./migrations").run(&pool).await?;

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
```

Since we're copying over all the files in our Dockerfile except for the `/target` output folder, our deployment process
should be bringing over our `/migrations` folder as well. One issue we'll run into, though, will be that our builds
might fail as sqlx will attempt to run compile-time checks against the target database that it won't necessarily have
the connectivity to at build-time. Let's add the `offline` feature to our manifest file, then run a
quick `cargo sqlx prepare` in the terminal to cache the database metadata our `query_as!()` macros need to run those
compile-time checks.

We should now see a `sqlx-data.json` file at the root of our project with some data about the tables, compiled queries,
and a few other things. Again, since we're copying everything over during the container build process, we'll get this
file included by default. To get our docker builds successfully running, we'll need to do one of two things:

- Add the `SQLX_OFFLINE` environment variable to our `.env` file
- OR, tell docker to ignore `.env` files while copying over from source

We'll go with option one, as there might be environment variables we'll want to load in eventually other than the
database URL, so we'll tell sqlx to use the cached metadata when building. Our `.env` file should look something like
this:

```shell
DATABASE_URL=postgres://postgres:mySuperSecretPassword!@localhost:5432/postgres?sslmode=disable
SQLX_OFFLINE=true
```

Now if we build our container locally with a `make build` our build should run through successfully, giving us the green
light to deploy to fly. Let's do that now:

```shell
> fly deploy.sh

# After a sifting through the build logs, we should see...
1 desired, 1 placed, 1 healthy, 0 unhealthy [health checks: 1 total] --> v15 deployed successfully
```

Your version may vary, but we've got fly's stamp of approval that the deployment was successful. Let's verify we're up
and running with a few `curl`s:

```shell
> curl --header "Content-Type: application/json" \
--request POST \
--data '{"name":"Pliny the Elder","notes":"Like drinking the nectar of the gods..."}' \
https://flying-with-rust-and-postgres.fly.dev/logs

{"id":"551a31a1-c7c0-4893-9185-7340a5bf31b3"}

# Now taking our ID and querying for the log...

curl -l https://flying-with-rust-and-postgres.fly.dev/logs/551a31a1-c7c0-4893-9185-7340a5bf31b3

{"name":"Pliny the Elder","notes":"Like drinking the nectar of the gods..."}
```

And just like, we're up and running with fly, Rust, and Postgres!

## Wrapping up

In my quest for a developer-friendly hosting platform, I've been thoroughly satisfied with what fly offers. I'm excited
to see what I can build, and without a doubt, I'll be looking for more excuses to host whatever I can with the platform.

All of the code we wrote today you can find within
my [blog samples](https://github.com/JoeyMckenzie/joey-mckenzie-tech/tree/main/samples/with-fly-postgres).

Until next time, friends!
