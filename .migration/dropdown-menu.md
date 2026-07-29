# dropdown-menu

2026-07-29 · transformation engine (legacy `new-york` style) · Radix DropdownMenu → Base UI Menu; clean.

## Changed

- `resources/js/components/ui/dropdown-menu.tsx` — `@radix-ui/react-dropdown-menu` → `import { Menu as DropdownMenuPrimitive } from "@base-ui/react/menu"` (public `DropdownMenu*` names unchanged).
  - `Content` → `Portal > Positioner > Popup`; positioning (`side`/`sideOffset`/`align`/`alignOffset`) via `Pick<…Positioner.Props>` forwarded to `<Positioner>` (`sideOffset={4}`, `Positioner` `isolate z-50 outline-none`).
  - Part renames: `Label`→`GroupLabel`, `ItemIndicator`→`CheckboxItemIndicator`/`RadioItemIndicator`, `Sub`→`SubmenuRoot`, `SubTrigger`→`SubmenuTrigger`.
  - `SubContent` rebuilt as `Portal > Positioner > Popup` with the golden submenu defaults `align="start" alignOffset={-3} side="right" sideOffset={0}`.
  - Class rewrites: item highlight `focus:bg-accent/text-accent-foreground` → `data-highlighted:*` (Base UI menu items expose `data-highlighted`, not `:focus`); destructive `data-[variant=destructive]:focus:*` → `data-[variant=destructive]:data-highlighted:*`; SubTrigger open `data-[state=open]:*` → `data-[popup-open]:*`; content/sub-content `animate-in/out zoom/slide` → transition idiom with `origin-[var(--transform-origin)]`. `data-[disabled]`, `data-[inset]`, `data-[variant=…]` unchanged.
- Consumers (`asChild` → `render`): `app-header.tsx` (`DropdownMenuTrigger` avatar), `nav-user.tsx` (`DropdownMenuTrigger` rendering `SidebarMenuButton`, plus CSS var `--radix-dropdown-menu-trigger-width` → `--anchor-width`), `user-menu-content.tsx` (two `DropdownMenuItem` → `render`).
- Leftover scan clean.

## Left alone

- `DropdownMenuShortcut` is a plain `<span>` — untouched.

## Behavior changes

- FLAG (close-on-click): Base UI `CheckboxItem`/`RadioItem` default `closeOnClick={false}`, whereas Radix closed the menu on select. Not patched (no such items are used in app code; the user-menu items are plain `Item`s, which still close on click).
- Item highlight is now keyboard/pointer `data-highlighted` rather than DOM `:focus`.

## Verify by hand

- Open the header avatar menu and the sidebar user menu: keyboard arrow navigation highlights items, Enter activates, Settings/Log-out links work, menu closes on select and on outside click. Confirm the sidebar user menu popup width matches the trigger (`--anchor-width`).
