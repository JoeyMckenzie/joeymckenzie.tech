---
title: 'Serverless databases with Rust and Neon'
description: 'Because who wants to manage their database infrastructure in 2023?'
pubDate: 'May 12 2023'
heroImage: '/blog/serverless-databases-with-rust-neon/meme.jpg'
category: 'postgres'
published: false
---

I've been on the hunt to keep myself sane while on paternity leave and have had
the itch to jump into more serverless products due to the recent release of
[Vercel's recent release](https://vercel.com/changelog/vercel-postgres) of their
Postgres offering. More than likely at every stage of a developer's career, we
need to work with data and some cases, lots of it.

I've been using a lot of [PlanetScale](https://planetscale.com/) recently,
getting my hands dirty with a [RealWorld implementation in Go](https://github.com/JoeyMckenzie/realworld-go-kit)
I wrote a while back utilizing the platform. Needless to say, having the ability
to work in a serverless fashion with a database similar to
other application architectures I've had a hand in building felt incredibly freeing.

As a developer, read: not a DBA, I don't want to worry too much about my database
internals and infrastructure. Maintaining multiple versions of schema can also be
quite the PITA especially when working on shared database instances in non-prod
environments with other developers on the team. Serverless database platforms
combat this with branching strategies similar to how we branch code using a
[trunk-based approach](https://trunkbaseddevelopment.com/) - I branch the
current database schema, make the changes I need, and use some form of
schema synchronization in either traditional database migrations or in
PlanetScale's case, [deploy requests](https://planetscale.com/docs/concepts/deploy-requests).

I've fallen in love with PlanetScale's approach schema evolution approach with
deploy requests, as it allows a form of circumvention for traditional database
migrations. There are a _ton_ of different migration tools, CLIs, and libraries
out there, though PlanetScale's deploy requests offer a form of normalization
amongst them all. No need to learn \_yet\_ another migration tool, - simply branch
and make your changes, then "PR" it back into the main database schema.

PlanetScale is great but only provides support for serverless MySQL. What about
serverless Postgres?

Enter [Neon](https://neon.tech/).

Neon is a serverless database platform for Postgres offering many of the same
great developer experiences as PlanetScale, with the obvious difference of
being Postgres-based as opposed to MySQL. As with every great piece of new
technology I come across, it's time to figure out how we can integrate it with Rust.

Let's build out a simple CRUD-based console application expanding on a previous
post involving logging awesome beers we've come across. To spice things up a bit,
let's _also_ add a logging mechanism for awesome breweries we've patronized as well.
To get started, let's spin up a new Rust binary:

```bash
cargo new --bin serverless-postgres-neon-rust && cd serverless-postgres-neon-rust
```

To make life easier, let's add [sqlx](https://github.com/launchbadge/sqlx) to handle
the nitty-gritty of mapping query results into PORS (plain old Rust `struct`s):

```bash
cargo add sqlx --features sqlx/runtime-tokio-rustls,postgres
# While we're at it, let's add tokio as well
cargo add tokio --features full
```

With our dependencies installed, let's hop over to Neon and create a database
for housing our journal entries.

![Creating database](/blog/serverless-databases-with-rust-neon/creating_database.png)

I'm creating my database in the US West region to keep things local. Once Neon
does some initialization and redirects to the project dashboard, we'll be presented
with some options to connect to our database:

![Database setup](/blog/serverless-databases-with-rust-neon/database_setup.png)

Don't get too excited about my password for connecting to the default database,
I'll be rotating it for the purpose of this blog. Now that we have connection
details setup and ready to go, let's grab a copy of the credentials and save them
off in a `.env` file we'll be able to utilize for loading in the connection string
at runtime to initialize a pooled connection to the database as well as allowing
sqlx to run some migration code for us to maintain our schema.

## .env

```bash
DATABASE_URL="postgres://username:password@server/database"
```

Update your `DATABASE_URL` based on the credentials Neon provides for your project.
I'm using the pooled connection string option Neon offers out of habit.
There's an option to connect to the database directly, though in a real
world scenario, it's not generally a good idea to consume single instance
connections. Pooled connections are better for the use case of something
like a long running web server that will also allow for the reuse of
recycled connections to the database server. While we _could_ use a single
direct connection here (as we'll see in a bit, we're running a one-time
console app), better to get into the habit of using pools instead.

Now that we've got our environment file in place, let's add [dotenvy](https://crates.io/crates/dotenvy)
to our dependencies to easily load in the connection string as an environment
variable. While we're at it (and mostly because I'm lazy), let's add [anyhow](https://crates.io/crates/anyhow)
to handle and propagate errors in an easier fashion:

```bash
cargo add dotenvy && cargo add anyhow
```

All set, let's verify our connection string is looking good when
we run our program:

## main.rs

```rust
use anyhow::Context;
use dotenvy;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().context("failed to load environment variables")?;

    let database_url = std::env::var("DATABASE_URL").context("failed to load connection string")?;
    println!("database_url: {}", database_url);

    Ok(())
}
```

If we run this, we should see our connection string spit out in the console.
Nice!

Now that we've got a connection string available, let's spin up a pooled
connection to Neon and verify we're able to ping the database as a sort
of health check to verify we're able to talk to the server:

## main.rs

```rust
use anyhow::Context;
use dotenvy;
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
```

With sqlx, we'll `.connect()` to the database which will establish a connection
to the pool, returning an error if we fail to do so due to a connection issue
like a malformed connection string. We'll ignore the `.context()?` propagted
errors for now, as those are syntactic sugar from `anyhow` to allow us to
simply and easily propagated string based errors back up the stack without
having to `impl` the necessary traits for error mapping.

If we spin up program now, we should still see the connection string print
out to the console and no errors, signalling that sqlx was able to establish
the connection to Neon _and_ initialize a connection string for us. Sweet!

I'll note that sqlx provides a handful of configuration options when spinning
connection pools like timeouts, maximum connection amounts, etc. For the purpose
of this exercise, we won't worry about those for now.

Now that we've verified our connection pool has been properly established,
let's get some tables in place so we can start writing data. I'm a fan of
[pgAdmin](https://www.pgadmin.org/) as a Postgres workbench, so I'll connect
my Neon instance using it. Postgres strings include the username, password,
server, and instance name so all the necessary information required by
pgAdmin is provided.

![pgAdmin](/blog/serverless-databases-with-rust-neon/pgadmin.png)

Let's tap into sqlx's handy dandy [CLI](https://lib.rs/crates/sqlx-cli) to
generate some migration files for us to write some SQL that will be applied
on startup to our Neon database:

```bash
# First install the CLI, overriding in case there's existing installations
cargo install --locked sqlx-cli

# Now we'll generate a new initial migration file
sqlx migrate add add_initial_journal_table
```

I find it helpful to give your migrations plenty of context in the names,
you'll never know when you'll need to refer to them in the future. Let's crack
open our generated SQL file and write a simple journal table:

## migrations/{timestamp}\_add_initial_journal_table.sql
