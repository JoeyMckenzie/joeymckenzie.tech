# joeymckenzie.tech

Welcome to my slice of the internet! This repository contains all the source code and content used on my blog. The project leverages:

- [Astro](https://astro.build) as the framework-of-choice as the site is primarily static content
- [Svelte](https://svelte.dev) for dynamic components, bootstrapped by Astro
- [Turborepo](https://turbo.build/repo) for task running and output caching
- A few build tools in [prettier](https://prettier.io/), [eslint](https://eslint.org/), [tailwind](https://tailwindcss.com), and [pnpm](https://pnpm.io/)
- Rust-based serverless functions hosted with [shuttle](https://shuttle.rs)

The code here is freely available for anyone to use. To get started, fork/[degit](https://github.com/Rich-Harris/degit) this repository and install dependencies:

```
npm install # or pnpm install
```

To start the dev server:

```
npm run dev # or pnpm dev
```

That's it! To run the serverless functions, make sure you have rust installed (preferably via [rustup](https://rustup.rs/)) and build. Before building, make sure to install [lld](https://lld.llvm.org/) to swap out the default linker for builds. If you prefer to use the default link, simply remove the `.cargo` directory and build.

## 🪝 Git hooks

There are two git hooks configured to run:

- pre-commit: will format all JS/TS and rust files with prettier and cargo, respectively, via [lint-staged](https://www.npmjs.com/package/lint-staged)
- pre-push: runs the build and lint targets to ensure all code is compilable and error-free before pushing to source control via turbo

Before pushing code, make sure to install turbo so that subsequent builds and lints are cached for faster task execution:

```
npm install -g turbo # or pnpm install turbo --global
turbo build lint # to initially populate the task execution cache
```

## 🚀 Project Structure

```
├── public/ # for public assets available to all astro pages and svelte components
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
