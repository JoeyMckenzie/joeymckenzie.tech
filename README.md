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
- [Contentlayer](https://contentlayer.dev/) for managing content
- [Neon](https://neon.tech) and [drizzle](https://orm.drizzle.team/) for database stuff
- Hosted on [Vercel](https://vercel.com)

The code here is freely available for anyone to use. To get started, fork/[degit](https://github.com/Rich-Harris/degit)
this repository and install dependencies:

## Getting Started

```bash
bun install # or npm/yarn/pnpm install
```

To start the dev server:
First, run the development server:

```bash
pnpm run dev # or npm/yarn/pnpm run dev
```

That's it! On build/run with the help of [concurrently](https://www.npmjs.com/package/concurrently), content types and
helpers will be generated along with spinning up the dev server.

## 🪝 Git hooks

There are two git hooks configured to run:

- pre-commit: will format all JS/TS, including examples, via [lint-staged](https://www.npmjs.com/package/lint-staged)
- pre-push: lints source files

Of course, you're free to remove these files along side the `prepare` script setting the git hook directory.
