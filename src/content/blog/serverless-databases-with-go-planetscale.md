---
title: 'Embracing the edge with Go, PlanetScale, and Fly'
description: 'Giving a whole new meaning to living life on the edge.'
pubDate: 'May 31 2023'
heroImage: '/blog/serverless-databases-with-go-planetscale/planetscale_meme.jpg'
category: 'go'
---

Another day, another post about something serverless. Keeping true to form over my last few posts, I've been messing around with just about everything serverless everything for personal projects. I recently delved into yet another implementation of GitHub's [RealWorld](https://github.com/gothinkster/realworld) spec, as I tend to do when exploring new languages and ecosystems, and Go was the language of choice this time around.

I've written a few implementations of the spec and I always seem to find my way back to it when experimenting with new things, and I've had the itch to write more Go lately utilizing a few cool tools I've found in the ecosystem. I ended up writing [my RealWorld Go implementation](https://github.com/JoeyMckenzie/realworld-go-kit) with some neat Go libraries, though mainly spearheaded by [Go Kit](https://github.com/go-kit/kit), [chi](https://github.com/go-chi/chi), [slog](https://pkg.go.dev/golang.org/x/exp/slog), and [sqlx](https://github.com/jmoiron/sqlx). To make things more interesting, I threw [PlanetScale](https://planetscale.com/) in the mix to spice things up a bit as I'm embracing life on the edge (in regards to software, not so much in general), alongside deployment to [Fly](https://fly.io/).

While not exactly a blog about the implementation details of the project (though there's a lot of neat stuff in there), I wanted to take a minute to explore Go, PlanetScale, and Fly as building RealWorld allowed me the opportunity to really dig into these edge services and learn quite a bit.

## Abstracting to edge

For those unfamiliar with PlanetScale, it's an awesome product that offers serverless MySQL databases that offer _probably_ my favorite feature to ever come out with database tech in [deploy requests](https://planetscale.com/docs/concepts/deploy-requests). Coupled with PlanetScale's [branching feature](https://planetscale.com/docs/concepts/branching/), I feel like I finally have the database migration DX I've always wanted.

As a .NET'er by day, I've spent a career working with [Entity Framework](https://learn.microsoft.com/en-us/ef/core/) for better or worse. There's a lot to love about EF and feature-rich ORMs and migration libraries in general. Conversely, there are a lot of sharp edges and tribal knowledge that go into learning a tool like EF, or its Go counterpart in [ent](https://entgo.io/).

Shifting mindsets to serverless and edge creates an opportunity to also archive my arcane knowledge of migration engines and libraries as well. While not exactly a complete offloading of knowledge, shifting the schema management approach to a tool like PlanetScale _feels_ like it empowers developers to bring their language of choice while they handle the rest. I'm sure I speak for most .NET devs in saying that I've my fair share of frustrations with EF, though being largely satisfied with the DX it brings.

Enough talk, let's get into the code.

## B.Y.O.S. (bring your own schema)

So as I mentioned, the beauty of PlanetScale is bringing a _semi-\_managed_ (there are still [a few limitations](https://planetscale.com/docs/reference/mysql-compatibility#queries-functions-syntax-data-types-and-sql-modes), like user-defined functions and triggers) database ready to roll at a few clicks of a button. For managing schema, this swayed me to shift my mental model of schema management:

- Ridding myself of tools like migration CLIs
- Maintaining a copy of the current version of the schema in code
- Incrementally changing schema through PlanetScale's deploy requests

To start, since this was a Go project, the natural choice to manage schema was a tool like [golang-migrate](https://github.com/golang-migrate/migrate) or the previously mentioned ent. The problem with using a schema/migration management tool alongside PlanetScale is the redundancy of work - PlanetScale deploy requests offer a Git-like workflow while also offering a reversion tool to manage the evolution of schema. The benefit of moving from a local migration management tool comes in the form of collaboration and public review.

My experience with migration tools has been more collaborative in the sense of working on shared pre-production databases _without_ some form of self-containment, i.e. PlanetScales branches, and clashing with other developers attempting to evolve rather complex schemas (I've also had the great misfortune of integrating legacy Oracle databases with modern EF, yikes).

Branching in PlanetScale seems to solve most of the issues I've had with traditional schema management, i.e. tools like EF and golang-migrate. Take for example the following schema:

```sql
-- While we could use a traditional migration tool, our use case for RealWorld is
-- simple enough that we won't reap the benefits of needing to evolve and maintain

-- We'll need a table for users, with username and email as an indexable key
DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    -- With MySQL, we'll store UUIDs as bytes, using the UUID Go type to map them into structs
    id         BINARY(16) PRIMARY KEY,
    username   VARCHAR(255)  NOT NULL,
    email      VARCHAR(255)  NOT NULL,
    password   VARCHAR(255)  NOT NULL,
    image      VARCHAR(4096) NOT NULL DEFAULT '',
    bio        VARCHAR(4096) NOT NULL DEFAULT '',
    created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY idx_users_username_email (username, email)
);
```
