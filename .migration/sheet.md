# sheet

2026-07-29 · transformation engine (legacy `new-york` style) · Dialog primitive, side-anchored Popup; clean.

## Changed

- `resources/js/components/ui/sheet.tsx` — built on `@radix-ui/react-dialog` → `import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"`. `Overlay`→`Backdrop`, `Content`→`Popup`. No Positioner (fixed side placement via classes).
  - Per-side slide animations rewritten from `slide-in/out-*` to Base UI transitions: base `transition ease-in-out duration-500 data-[ending-style]:duration-300`, plus per-side `data-[starting-style]:translate-*-full data-[ending-style]:translate-*-full` (`translate-x-full`/`-translate-x-full`/`translate-y-full`/`-translate-y-full` for right/left/bottom/top).
  - Backdrop fade rewritten to `transition-opacity data-[starting-style]/[ending-style]:opacity-0`.
  - Close button `data-[state=open]:*` → `data-[open]:*`.
  - Export list unchanged (`SheetPortal`/`SheetOverlay` remain internal, matching the original).
- Consumer (`asChild` → `render`): `resources/js/components/app-header.tsx` (`SheetTrigger` mobile menu button).
- Leftover scan clean.

## Left alone

- `SheetHeader`/`SheetFooter` are plain `<div>`s — untouched.

## Behavior changes

- Same dismiss/focus consolidation as dialog (none used at call sites).

## Verify by hand

- On mobile width, open the header hamburger sheet: slides in from the left, backdrop fades. Close via Esc / backdrop / X; slides out.
