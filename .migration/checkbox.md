# checkbox

2026-07-29 · transformation engine (legacy `new-york` style) · direct 1:1 with data-attr rewrites; clean.

## Changed

- `resources/js/components/ui/checkbox.tsx` — `@radix-ui/react-checkbox` → `import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"`. `Root`/`Indicator` map 1:1.
- Class rewrites: `data-[state=checked]:*` → `data-checked:*`. Base UI Checkbox Root renders a `<span>` (not a `<button>`), so the `:disabled` pseudo no longer fires — `disabled:cursor-not-allowed disabled:opacity-50` rewritten to `data-disabled:cursor-not-allowed data-disabled:opacity-50` (per class-mapping "element changes kill pseudo-class variants"). Note: the shadcn base registry keeps the dead `disabled:*` classes as an upstream quirk; this migration converts them so the disabled visual actually works.
- Leftover scan clean.

## Left alone

- No consumer call sites use `checked="indeterminate"` (which would need splitting into the separate `indeterminate` boolean prop). Nothing to sweep.

## Behavior changes

- `onCheckedChange` now fires `(checked: boolean, eventDetails)`; single-arg handlers stay type-safe. Indeterminate is now a separate `indeterminate` prop (unused here).

## Verify by hand

- Toggle a checkbox: checked bg/border and check icon appear.
- Disable a checkbox: confirm 50% opacity + not-allowed cursor (now driven by `data-disabled`).
