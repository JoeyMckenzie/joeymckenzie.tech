---
name: stylex
description: StyleX styling for this codebase. Use when writing or editing any style, adding or restyling a component, touching stylex.create/props/defineVars/createTheme, changing the babel or postcss config, or converting Tailwind classes, cn(), or cva() variants to StyleX.
---

# StyleX

StyleX is a build-time compiler. Styles are extracted to atomic CSS at compile
time, so a style the compiler cannot see statically does not exist at runtime —
and fails silently, rendering an unstyled element rather than an error. Every
rule in the references follows from that, and it is why the checks at the
bottom of this file are build checks.

## Route

Read the reference for your branch **before** writing code. Do not write StyleX
from memory: the API is close enough to CSS-in-JS you have seen to feel
familiar and different enough to be wrong.

| Doing                                                                   | Read                                                                                 |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| writing or editing styles, in any file                                  | [`references/authoring.md`](references/authoring.md)                                 |
| converting a Tailwind/shadcn/`cva` component, or planning the migration | [`references/migration.md`](references/migration.md), then `authoring.md`            |
| installing StyleX, or changing babel/postcss/build config               | [`references/installation.md`](references/installation.md), then **This repo** below |

`authoring.md` and `installation.md` are the upstream StyleX docs, vendored
verbatim from <https://stylexjs.com/docs/llm-resources>. Re-download them to
update; a hand edit is lost on the next sync, so repo-specific facts go in this
file or in `migration.md`.

## This repo

Where `installation.md`'s generic Next.js advice is wrong here. The build is
already configured — read `babel.config.js` and `postcss.config.mjs`, which
carry the same reasoning at the point of use. This is the summary.

- **Babel config carries the StyleX plugin only, plus `parserOpts`.** This is
  Next 16 on Turbopack, which auto-detects a Babel config file and runs it
  _while SWC still handles Next's internal transforms and downleveling_
  (`node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md`).
  `installation.md`'s `presets: ['next/babel']` is webpack-era advice; under
  Turbopack it re-runs work SWC has already done. But dropping the preset also
  drops Babel's ability to _parse_ TS and JSX, and it fails on the first
  `import type` — so the config sets `parserOpts` (`typescript` everywhere,
  `jsx` scoped to `.tsx` via `overrides`) to restore syntax without adding a
  transform.
- **A Babel pass in front of Turbopack breaks `@/` aliases in dynamic
  imports.** A file that has been through a loader no longer gets the alias
  applied when Turbopack resolves a template-literal `import()` into a context
  module: `app/blog/[slug]/page.tsx` had to switch to a relative specifier.
  Static imports are unaffected. If a build fails with
  `Module not found: Can't resolve '@/… ' <dynamic> '…'`, this is why.
- **The PostCSS plugin must not be handed the Babel plugin list.** The StyleX
  docs import `babel.config.js` into `postcss.config.js` and pass
  `plugins: babelConfig.plugins` through. Turbopack serialises the PostCSS
  config across its Rust boundary and rewrites every project-root path in it to
  the literal string `/ROOT/`, so the plugin arrives with
  `aliases: {"@/*": ["/ROOT/*"]}` and cannot resolve `@/app/tokens.stylex` --
  `Could not resolve the path to the imported file`, reported against
  `app/globals.css`. Omitting `plugins` lets Babel load `babel.config.js`
  itself inside the worker, where `__dirname` is real.
- **Babel's `ignore` does nothing.** Next's loader hands Babel a placeholder
  filename when it resolves the config, so path-based `ignore`/`only` entries
  never match. Do not reach for them to scope what Babel sees.
- **`postcss.config.mjs` is ESM.** `installation.md` writes CommonJS
  (`require`/`module.exports`). Use `import`/`export default` and keep the
  `.mjs` extension.
- **`useCSSLayers` stays `false`.** Tailwind is gone, but `app/globals.css`
  still holds a reset, the element defaults and the prose stylesheet.
  Unlayered StyleX outranking an element-level rule is the behaviour we want;
  layering it would invert that and let a stray `body {}` rule beat a
  component.
- **Static export.** `output: "export"` means no server runtime, so
  `runtimeInjection` stays `false` — there is nothing to inject styles at
  runtime.

`aliases: { '@/*': ... }` in the babel plugin config must match the `@/*` path
in `tsconfig.json`, or imports from `@/app/tokens.stylex` resolve to nothing and
their vars compile away.

## Before calling it done

- `npm run build` passes. A dev server that renders is not proof: StyleX
  failures are compile-time and silent, and dev mode emits readable class names
  production does not.
- No element carries a `stylex.props()` spread alongside a `className` or
  `style` prop — including an implicit one from a `{...props}` spread placed
  after it.
- No style value is imported from anything but a `.stylex.ts` module.
- `npm run lint` and `npm run types:check` pass.
