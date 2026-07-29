# tooltip

2026-07-29 · transformation engine (legacy `new-york` style) · positioner model; clean.

## Changed

- `resources/js/components/ui/tooltip.tsx` — `@radix-ui/react-tooltip` → `import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"`.
  - `TooltipProvider`: `delayDuration` → `delay` (default kept at `0`).
  - `TooltipContent`: `Portal > Content` → `Portal > Positioner > Popup`. Positioning props (`side`/`sideOffset`/`align`/`alignOffset`) declared via `Pick<…Positioner.Props>` and forwarded to `<Positioner>` (default `sideOffset={4}`); `Positioner` gets `isolate z-50`, `Popup` keeps `z-50`.
  - Animation rewrite: `animate-in/out` + `slide-in-from-*` → transition idiom `transition-[transform,scale,opacity] data-[starting-style]:{scale-95,opacity-0} data-[ending-style]:{scale-95,opacity-0}` with `origin-[var(--transform-origin)]`.
  - Arrow: kept as a rotated `bg-primary` square, repositioned per side via `data-[side=…]` offsets (plain-Tailwind project — cn-* companion hooks skipped).
- Consumer: `resources/js/app.tsx` — `<TooltipProvider delayDuration={0}>` → `delay={0}`.
- Leftover scan clean.

## Left alone

- `app-header.tsx` uses `Tooltip`/`TooltipTrigger`/`TooltipContent` with default props — no call-site changes beyond the provider.

## Behavior changes

- `skipDelayDuration` concept dropped (was unused). `disableHoverableContent` had no equivalent (unused). Default `sideOffset` semantics preserved (4).
- Arrow: no longer uses Radix's rotation/translate offset math; per-side placement approximated. Visually verify.

## Verify by hand

- Hover the header repository/documentation icons: tooltip appears near-instantly (`delay=0`), points at the trigger, and the arrow sits against the correct edge. Move mouse away: it fades out.
