# select

2026-07-29 · transformation engine (legacy `new-york` style) · restructured (Content split, Viewport→List); clean.

## Changed

- `resources/js/components/ui/select.tsx` — `@radix-ui/react-select` → `import { Select as SelectPrimitive } from "@base-ui/react/select"`.
  - `Select` is now a bare re-export `const Select = SelectPrimitive.Root` (sidesteps the generic `Root.Props<Value, Multiple>` that breaks `ComponentProps`; Root renders no DOM so the dropped `data-slot="select"` was inert anyway).
  - `Content` → `Portal > Positioner > Popup`; `Viewport` → `List`; `ScrollUpButton`/`ScrollDownButton` → `ScrollUpArrow`/`ScrollDownArrow`; `Label` → `GroupLabel`; `Icon` `asChild` → `render`.
  - `position="popper"` dropped → `alignItemWithTrigger` (default `false`, matching the wrapper's prior hardcoded popper mode); popper translate + `--anchor-height`/`--anchor-width` sizing gated on `!alignItemWithTrigger`.
  - CSS var renames: `--radix-select-content-available-height`→`--available-height`, `--radix-select-content-transform-origin`→`--transform-origin`, `--radix-select-trigger-height`→`--anchor-height`, `--radix-select-trigger-width`→`--anchor-width`. `isolate z-50` on the Popup.
  - Item highlight `focus:*` → `data-highlighted:*`; `data-[placeholder]`/`data-[disabled]`/`data-[size=…]` unchanged; Trigger renders a real `<button>` so `disabled:*` kept.
  - Animation `animate-in/out zoom/slide` → transition idiom.
- Leftover scan clean.

## Left alone

- No `<Select>` consumers found in app code (component is available but unused). No call-site sweep needed.

## Behavior changes

- `onValueChange` widens to `(value: Value | null, eventDetails)`. FLAG: a future `useState<string>` + `onValueChange={setState}` call site would need `string | null`. None today.
- `position` prop removed in favour of `alignItemWithTrigger`.

## Verify by hand

- If used later: open a select, keyboard-typeahead + arrow navigation highlight items, selection shows a check, placeholder styling intact, scroll arrows appear on long lists.
