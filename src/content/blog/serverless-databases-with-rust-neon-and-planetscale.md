---
title: 'Serverless databases with Rust, Neon, and PlanetScale'
description: 'Because who wants to manage their database infrastructure in 2023?'
pubDate: 'May 12 2023'
heroImage: '/blog/serverless-postgres-neon-rust/neon_meme.jpg'
category: 'postgres'
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
migrations. There are a _ton\_\_ of different migration tools, CLIs, and libraries
out there, though PlanetScale's deploy requests offer a form of normalization
amongst them all. No need to learn \_yet_ another migration tool, - simply branch
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
