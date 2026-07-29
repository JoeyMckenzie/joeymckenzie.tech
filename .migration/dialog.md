# dialog

2026-07-29 · transformation engine (legacy `new-york` style) · Overlay→Backdrop, Content→Popup; clean.

## Changed

- `resources/js/components/ui/dialog.tsx` — `@radix-ui/react-dialog` → `import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"`. `Overlay`→`Backdrop` (public name `DialogOverlay` kept), `Content`→`Popup` (centered modal, NO Positioner). `Title`/`Description`/`Close`/`Trigger`/`Portal` map 1:1.
  - Animation rewrite (Backdrop): `animate-in/out fade` → `transition-opacity data-[starting-style]:opacity-0 data-[ending-style]:opacity-0`.
  - Animation rewrite (Popup): `animate-in/out zoom` → `transition-[transform,scale,opacity] data-[starting-style]:{scale-95,opacity-0} data-[ending-style]:{scale-95,opacity-0}` (centering `translate-x/y-[-50%]` preserved).
  - Close button `data-[state=open]:*` → `data-[open]:*`.
- Consumers (`asChild` → `render`): `resources/js/components/delete-user.tsx` (`DialogTrigger`, `DialogClose`), `resources/js/components/passkey-item.tsx` (`DialogTrigger`, `DialogClose`).
- Leftover scan clean.

## Left alone

- `DialogHeader`/`DialogFooter` are plain `<div>`s — untouched.

## Behavior changes

- Radix dismiss/focus callbacks (`onOpenAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, …) are consolidated into `onOpenChange(open, eventDetails)` / Popup `initialFocus`/`finalFocus` / Root `modal`. None were used at call sites, so no restructuring was needed.

## Verify by hand

- Open the delete-account and remove-passkey dialogs: backdrop fades in, popup zooms in centered, focus lands inside.
- Esc and backdrop-click close; focus returns to the trigger. Cancel button closes.
