# badge

2026-07-29 · transformation engine (legacy `new-york` style) · Slot → useRender; clean.

## Changed

- `resources/js/components/ui/badge.tsx` — `@radix-ui/react-slot` `Slot`/`asChild` idiom → `useRender` + `mergeProps` (`@base-ui/react/use-render`, `@base-ui/react/merge-props`). Props typed `useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>`; `render` replaces `asChild`. The `data-slot`/`className` object literal is cast `as React.ComponentProps<"span">` (required so `data-*` keys pass excess-property checking into `mergeProps`). `badgeVariants` unchanged.
- Leftover scan clean.

## Left alone

- No `<Badge asChild>` consumers found in app code; nothing to sweep.

## Behavior changes

- None. Polymorphic `render` behaves as `asChild` did (`[a&]:hover:*` link variants still work when `render={<a/>}`).

## Verify by hand

- Render each badge variant; if any `render={<a/>}` badge exists, confirm link hover states.
