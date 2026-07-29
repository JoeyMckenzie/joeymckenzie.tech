# toggle-group

2026-07-29 · transformation engine (legacy `new-york` style) · callable group + Toggle items; clean.

## Changed

- `resources/js/components/ui/toggle-group.tsx` — `@radix-ui/react-toggle-group` → callable `import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"`; items now use the Base UI Toggle primitive (`import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"`) since Base UI reuses Toggle as group items. `ToggleGroupPrimitive.Root`→callable `ToggleGroup`; `ToggleGroupPrimitive.Item`→`Toggle`. Props typed `ToggleGroupPrimitive.Props` / `TogglePrimitive.Props`. Context + `toggleVariants` composition preserved; `data-[variant=…]` classes unchanged.
- Leftover scan clean.

## Left alone

- No `<ToggleGroup>` consumers in app code; nothing to sweep.

## Behavior changes

- Value model is now always an array (even single mode); `type="single"|"multiple"` → `multiple` boolean; `rovingFocus`/`loop`→`loopFocus`. FLAG: if a future consumer sets `type=` or `value="…"` (string), it must switch to `multiple`/array form. None exist today.

## Verify by hand

- If used later: single-select group toggles exclusively; multi-select accumulates.
