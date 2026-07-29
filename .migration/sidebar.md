# sidebar

2026-07-29 · transformation engine (legacy `new-york` style) · Slot → useRender on 5 polymorphic parts; clean.

## Changed

- `resources/js/components/ui/sidebar.tsx` — the only Radix dependency was `@radix-ui/react-slot` (`Slot`/`asChild`). Converted all five polymorphic sub-components to `useRender` + `mergeProps`, `render` replacing `asChild`, with the `data-*`/`className` object literals cast to `React.ComponentProps<"tag">`:
  - `SidebarGroupLabel` (`div`), `SidebarGroupAction` (`button`), `SidebarMenuButton` (`button`), `SidebarMenuAction` (`button`), `SidebarMenuSubButton` (`a`).
  - `SidebarMenuButton`'s tooltip path: `<TooltipTrigger asChild>{button}</TooltipTrigger>` → `<TooltipTrigger render={button} />` (the `button` is the `useRender(...)` element).
  - Class rewrites: `sidebarMenuButtonVariants` and `SidebarMenuAction` `data-[state=open]:*` → `data-[popup-open]:*` (sidebar buttons are used as menu triggers). All other `data-*` (`data-[active=true]`, `data-[size=…]`, `group-data-[collapsible=…]`, etc.) unchanged.
  - Composed wrappers (`Sheet`, `Button`, `Input`, `Separator`, `Skeleton`, `Tooltip`) are imported from already-migrated ui modules — names unchanged.
- Consumers (`asChild` → `render`): `app-sidebar.tsx` (`SidebarMenuButton` logo link), `nav-footer.tsx` (`SidebarMenuButton` external link), `nav-main.tsx` (`SidebarMenuButton` nav link), `nav-user.tsx` (`SidebarMenuButton` inside `DropdownMenuTrigger render`).
- Leftover scan clean.

## Left alone

- All the plain-markup sidebar parts (`SidebarProvider`, `Sidebar`, `SidebarRail`, `SidebarInset`, headers/footers/menus, `SidebarMenuSkeleton`, badges) — no Radix.

## Behavior changes

- FLAG (ambiguous state hook): sidebar menu buttons' `data-[state=open]:*` was mapped to `data-[popup-open]:*` (menu-trigger case, which is how `nav-user.tsx` uses it). If a sidebar button is ever used as a **Collapsible** trigger instead, that state is `data-[panel-open]` — revisit then. No collapsible-trigger usage exists today.

## Verify by hand

- Toggle the sidebar (Cmd/Ctrl+B) and rail; collapsed/expanded transitions work.
- Logo, platform nav, footer external links, and the user dropdown (opened from `SidebarMenuButton`) all render and navigate; the user button shows the accent bg while its menu is open.
- Mobile: sidebar renders inside the Sheet.
