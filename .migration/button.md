# button

2026-07-29 · transformation engine (legacy `new-york` style, in-place) · migrated to the real Base UI Button primitive; clean.

## Changed

- `resources/js/components/ui/button.tsx` — `@radix-ui/react-slot` `Slot`/`asChild` idiom → `import { Button as ButtonPrimitive } from "@base-ui/react/button"`. Dropped the `asChild`/`Comp` polymorphism; the wrapper now renders `<ButtonPrimitive>` directly (it supports `render` natively). Props typed `ButtonPrimitive.Props & VariantProps<typeof buttonVariants>`. `buttonVariants` cva string unchanged.
- Consumer call sites (`asChild` → `render`, child moved into `render`): `resources/js/components/delete-user.tsx` (submit button), `resources/js/layouts/settings/layout.tsx` (nav links). Buttons also render inside migrated triggers (`app-header.tsx`, `passkey-item.tsx`) — see those components' notes.
- Leftover scan clean: `grep -n "radix-ui\|@radix-ui" button.tsx` → none.

## Left alone

- Nothing. `buttonVariants` is re-exported and consumed widely (sidebar, etc.) — unchanged.

## Behavior changes

- None expected. Base UI Button renders a `<button>` and forwards `render` for polymorphism exactly as `asChild` did.

## Verify by hand

- Click every button variant; confirm `variant`/`size` styles unchanged.
- Confirm `render`-based buttons (settings nav `<Link>`, delete-user submit `<button type="submit">`) still navigate/submit and keep button styling.
