# joeymckenzie.tech

<div style="display: inline-block;">
  <img src="https://github.com/JoeyMckenzie/joeymckenzie.tech/actions/workflows/ci.yml/badge.svg" />
  <img src="https://github.com/JoeyMckenzie/joeymckenzie.tech/actions/workflows/deploy.yml/badge.svg"/>
</div>

My personal website and tech blog where I write about languages, frameworks, ecosystems, and sometimes beer. A list of
technologies that help power this overly complicated glorified landing page:

- [Rust](https://www.rust-lang.org/) 🦀
- [Leptos](https://leptos.dev/) - a full stack Rust framework for the web
- [Neon](https://neon.tech/) - serverless Postgres
- [DaisyUI](https://daisyui.com/) - Tailwind made easy
- [Fly](https://fly.io/) - containerized hosting
- [Shiki](https://shiki.matsu.io/) - code highlighting
- A bunch of helpful crates like [sqlx](https://github.com/launchbadge/sqlx) and [axum](https://docs.rs/axum/latest/axum/)

## Getting started

Anyone is free to clone/copy this repository for their own use case. To get started, make sure [`cargo-make`](https://sagiegurari.github.io/cargo-make/) is installed. There's quite a few tasks,
but the primary ones I use are the `dev` and `content` tasks. Simply spin up the local dev server with
`cargo make dev` and you're all set!
