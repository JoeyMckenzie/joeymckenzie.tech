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

Four places where `installation.md`'s generic Next.js advice is wrong here.

- **Babel config carries the StyleX plugin only.** This is Next 16 on
  Turbopack, which auto-detects a Babel config file and runs it _while SWC
  still handles Next's internal transforms and downleveling_
  (`node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md`).
  `installation.md`'s `presets: ['next/babel']` is webpack-era advice; under
  Turbopack it re-runs transforms SWC has already done. Omit it.
- **`postcss.config.mjs` is ESM.** `installation.md` writes CommonJS
  (`require`/`module.exports`). Use `import`/`export default` and keep the
  `.mjs` extension.
- **Tailwind's PostCSS plugin stays until the last Tailwind class is gone.**
  Both plugins run side by side through the whole migration. While they
  coexist, `useCSSLayers: false` so StyleX outranks leftover utilities; flip it
  to `true` once Tailwind is removed.
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
