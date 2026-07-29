# separator

2026-07-29 · transformation engine (legacy `new-york` style) · direct callable primitive; clean.

## Changed

- `resources/js/components/ui/separator.tsx` — `@radix-ui/react-separator` `SeparatorPrimitive.Root` → callable `import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"`. Dropped the `decorative` prop (Base UI separators are always semantic `role="separator"`; no equivalent). `orientation` default `"horizontal"` kept; `data-[orientation=…]` classes unchanged (still parameterized).
- Leftover scan clean.

## Left alone

- Consumers pass only `orientation`/`className` (e.g. `sidebar.tsx`'s `SidebarSeparator`); no call site used `decorative`, so no sweep edits.

## Behavior changes

- `decorative` removed: the separator is now always exposed to the accessibility tree (`role="separator"`). Previously `decorative={true}` (the wrapper default) hid it from AT. Flagged, not patched — if a purely-visual rule is wanted somewhere, use a plain `<div aria-hidden>`.

## Verify by hand

- Visual: horizontal/vertical rules still render at the right size.
