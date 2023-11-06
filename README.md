# joeymckenzie.tech

[![CI](https://github.com/JoeyMckenzie/joey-mckenzie-tech/actions/workflows/ci.yml/badge.svg)](https://github.com/JoeyMckenzie/joey-mckenzie-tech/actions/workflows/ci.yml)

Welcome to my personal slice of the internet. This repository contains all the source code and content used on my blog.
The
project leverages:

- [SvelteKit](https://kit.svelte.dev) as the framework of choice as the site is primarily static content
- [Tailwind](https://tailwindcss.com) for styling
- [shadcn/ui for Svelte](https://www.shadcn-svelte.com) for components
- A few build tools
  in [prettier](https://prettier.io/), [eslint](https://eslint.org/), [tailwind](https://tailwindcss.com),
  and [bun](https://bun.sh/)
- Hosted on [Vercel](https://vercel.com)

The code here is freely available for anyone to use. To get started, fork/[degit](https://github.com/Rich-Harris/degit)
this repository and install dependencies:

## Getting Started

```bash
npm install # or pnpm install
```

To start the dev server:
First, run the development server:

```bash
npm run dev # or pnpm dev
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

That's it! To run the serverless functions, make sure you have rust installed (preferably
via [rustup](https://rustup.rs/)) and build. Before building, make sure to
install [mold](https://github.com/rui314/mold) (the successor to [lld](https://lld.llvm.org/)) to swap out the default
linker for builds. If you prefer to use the default link, simply remove the `.cargo` directory and build.

## 🪝 Git hooks

There are two git hooks configured to run:

- pre-commit: will format all JS/TS and rust files with prettier and cargo, respectively,
  via [lint-staged](https://www.npmjs.com/package/lint-staged)
- pre-push: runs the build and lint targets to ensure all code is compilable and error-free before pushing to source
  control via turbo
  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Before pushing code, make sure to install turbo so that subsequent builds and lints are cached for faster task
execution:
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

```bash
npm install -g turbo # or pnpm install turbo --global
turbo build lint # to initially populate the task execution cache
```

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and
load Inter, a custom Google Font.

## 🚀 Project Structure

## Learn More

```bash
├── public/ # for public assets available to all astro pages and svelte components
├── samples/ # code samples from blog posts
├── src/
│   ├── components/ # various page components and svelte integration components
│   ├── content/ # markdown files powering the blog
│   ├── layouts/ # parent layouts used by all pages
│   ├── pages/ # routes available in the application
│   ├── serverless/ # rust serverless functions
│   └── styles/ # tailwind styles and fonts
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

To learn more about Next.js, take a look at the following resources:

## Deploying to shuttle

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

I leverage serverless functions to retrieve data using rust with the help of [shuttle](https://shuttle.rs), a serverless
provider allowing users to write rust for their serverless backends. To get started, first install `cargo-shuttle`:
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions
are welcome!

```bash
cargo install --locked cargo-shuttle
```

## Deploy on Vercel

Next, sign up for an account and authenticate the CLI:
The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

```bash
cargo shuttle login --api-key {{ your API key here }}
```

Finally, create a project workspace and deploy

```bash
cargo shuttle init # follow the prompts
cargo shuttle deploy
```

That's it! You should now have a serverless function running at the output URL based on the code found in
the `src/serverless` directory.

## Running shuttle functions locally

Shuttle recently made some core infrastructure changes requiring `protoc` to be installed on the target machine.
Instructions for installing `protoc` can be found [on the website](https://docs.shuttle.rs/support/installing-protoc)
with implementations varying depending on machines and package managers. An example can be found in the rust
build/deploy actions, or simply installing `protobuf` with `brew`:

```bash
brew install protobuf
```

Verify your installation with:

```bash
protoc --version
```

Note that older versions of `protoc` will not work, thus the minor workarounds found in the docs or by simply
using `brew`. Once installed, you can start local functions with:

```bash
cargo shuttle run
```

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
