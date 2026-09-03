# Context

Personal site. Next.js static export, StyleX for styling, Cloudflare Pages for
hosting. Notes here are the "why" behind things that look arbitrary in the
config. Per-area notes live in `app/CONTEXT.md`, `components/CONTEXT.md`, and
`lib/CONTEXT.md`.

## Static export

`output: "export"` in `next.config.ts`. Cloudflare serves `out/` as plain
files. No server runtime, which rules out route handlers that read the request,
server actions, and server-side `searchParams`. The RSS route and the sitemap
are both `force-static` for that reason, and `dynamicParams = false` on the post
route because a static export cannot render a slug that was not built.

The build is the real test: `output: "export"` fails loudly on anything a static
export cannot represent, so a green `ci-build` is the guarantee the site ships.

`trailingSlash: true` because the old astro site linked posts as `/blog/<slug>/`.
`images.unoptimized` because the default loader needs a server.

`allowedDevOrigins` matters more than it looks. `next dev` blocks its own
dev-only assets for any origin it was not started on, and a refused HMR socket
stalls the Turbopack dev bootstrap — pages render server HTML and then never
hydrate, so every click handler is silently dead. Dev-only; `next build` ignores it.

## StyleX pipeline

StyleX is a compiler. `stylex.create` calls are read at build time and their CSS
is extracted; without the Babel plugin the calls survive into the bundle and
paint nothing. `app/globals.css` starts with `@stylex;`, which is where the
compiler writes everything it extracts. All of it is class selectors, so it
outranks the element-level rules in that file regardless of ordering.

**`babel.config.js` has no `presets`, on purpose.** The StyleX docs tell you to
add `next/babel`, but that is webpack-era advice. Turbopack (default since Next 16) detects this file, runs Babel with it, and still runs SWC for Next's own
transforms and downleveling — the preset would redo work SWC has already done.
See `node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md`.

Dropping the preset means Babel no longer knows how to _read_ TypeScript or JSX,
and every file it sees is one or both, so it fails on the first `import type`.
`parserOpts` turns the syntax back on without adding a transform: Babel parses,
the StyleX plugin works, types and JSX pass through untouched for SWC to strip
downstream. `jsx` is scoped to `.tsx` because in a `.ts` file it makes the parser
read the `<T>` in `<T>(x: T) => x` as an unclosed JSX tag.

Plugin options worth knowing:

- `dev` gives readable class names and a source map back to the `stylex.create`
  that produced them. Off in production, where the point is the shortest atomic class.
- `runtimeInjection: false` — static export, no server runtime to inject from.
- `treeshakeCompensation: true` — style objects look unused to a bundler (they
  are consumed by the compiler, not runtime code) and get dropped without it.
- `aliases` **must track `paths` in `tsconfig.json`.** If they disagree, an import
  of `@/app/tokens.stylex` resolves to nothing and its variables silently compile away.

**`postcss.config.mjs` deliberately omits `plugins` from `babelConfig`,** though
the StyleX docs import them from `babel.config.js` and pass them through.
Turbopack serialises this config across its Rust boundary and rewrites every
project-root path to the literal string `/ROOT/` — which turns the plugin's
`aliases` into `{"@/*": ["/ROOT/*"]}` and leaves it unable to resolve
`@/app/tokens.stylex`. Omitting `plugins` lets Babel load `babel.config.js`
itself, inside the worker, where `__dirname` is a real path.

`useCSSLayers: false`, left that way now that Tailwind is gone. There is still
hand-written CSS in `app/globals.css` — element defaults and the prose sheet —
and unlayered StyleX outranking an element-level rule is what we want. Layering
would invert that and let a stray `body {}` rule beat a component.

## MDX

Every post is `.md`. `@mdx-js/loader` is format-aware, so a `.md` file parses as
plain markdown with no JSX — which matters because the posts are full of raw `<`
and `{` in code and prose.

Turbopack can't accept plugin functions across the Rust boundary, so plugins are
named as strings with serializable options. `remark-frontmatter` strips the YAML
block (`lib/posts.ts` is what actually reads it); `remark-gfm` for tables and
`~~strikethrough~~`; `@shikijs/rehype` with `tokyo-night` for highlighting.

## Lint

StyleX fails silently — an invalid property or a style object nothing reads
compiles to no CSS rather than to an error — so `valid-styles` and `no-unused`
are the only thing between a typo and an unstyled element in production.

`@stylexjs/sort-keys` is deliberately off. It wants style keys alphabetical,
which scrambles the grouping these blocks are written in (layout, box, type,
state), and that grouping is what makes a 30-property style readable at a glance.
It earns its keep on a large team as merge-conflict insurance; there is no team here.

`babel.config.js` gets a `no-require-imports` exemption because Babel loads it as
CommonJS — `package.json` declares no `"type": "module"`.

## Deploy

Cloudflare **Pages**, not a Worker. `pages_build_output_dir` in `wrangler.jsonc`
is the key that tells wrangler which it is, and it points at the directory
`output: "export"` writes to. There is deliberately no `main` — nothing runs
server-side.

Pages serves `out/404.html` for any path it cannot match, so `app/not-found.tsx`
needs no routing config. (Workers static assets would need an explicit
`not_found_handling` setting to reach it.) Caching and security headers come from
`public/_headers`, which Next copies into `out/` verbatim.

Every matching block in that file applies, not only the most specific one, and a
header named by two matching blocks arrives with both values comma-joined. So a
block should set only what is specific to it. Verified with
`npx wrangler pages dev out`, which runs the real Pages runtime over a build and
is the only way to check that file short of deploying. **Two pre-existing blocks
predate this understanding and still repeat headers the catch-all supplies**, so
hashed assets currently go out with
`Cache-Control: public, max-age=31536000, immutable, public, max-age=0, must-revalidate`
— two conflicting `max-age` values in one header, which may be costing the
long-lived cache on `_next/static`.

## CI and devenv

The pipeline lives in `devenv.nix` as `ci-lint` / `ci-build` / `ci-deploy`, not
in the workflow file, so it runs identically on a laptop and on a runner.
`.github/workflows/ci.yml` only sets up devenv and calls these.

`ci-lint` is checks only, no build — a formatting slip reports as a formatting
slip in seconds instead of after a full build. `ci-deploy` rebuilds rather than
reusing `ci-build`'s output: each job sets up its own devenv shell anyway, and
passing `out/` between them as an artifact costs more than the rebuild does. It
passes `--branch` explicitly because a runner checks out a detached HEAD, where
wrangler's own branch detection reports nothing and Pages uses it to decide
production vs preview.

Wrangler reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from the
environment. The Pages project (`website`) must exist before the first run —
wrangler will not create it on deploy.

**CI triggers on `poc/nextjs-again`, not `main`.** `main` is the Laravel app and
carries its own `ci.yml` deploying to Laravel Cloud. Promoting the Next rewrite
means changing the three branch references in `ci.yml` and reconciling with that
file.

The `dev` process kills anything already on port 3000 first: `next dev` picks a
different port when 3000 is taken, which silently breaks the caddy reverse proxy
pointed at it.
