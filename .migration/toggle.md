# toggle

2026-07-29 · transformation engine (legacy `new-york` style) · callable primitive; clean.

## Changed

- `resources/js/components/ui/toggle.tsx` — `@radix-ui/react-toggle` `TogglePrimitive.Root` → callable `import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"`. Props `TogglePrimitive.Props & VariantProps<typeof toggleVariants>`.
- Class rewrite in `toggleVariants`: `data-[state=on]:*` → `data-pressed:*`. Toggle renders a real `<button>`, so `disabled:*` is kept.
- Leftover scan clean.

## Left alone

- No standalone `<Toggle>` consumers in app code (only `toggleVariants` is reused by `toggle-group.tsx`).

## Behavior changes

- `onPressedChange` now `(pressed, eventDetails)`; single-arg handlers unaffected.

## Verify by hand

- Toggle pressed/unpressed: `data-pressed` accent styling applies.
