# navigation-menu

2026-07-29 · transformation engine (legacy `new-york` style) · heavily restructured (anchored Positioner model); clean.

## Changed

- `resources/js/components/ui/navigation-menu.tsx` — `@radix-ui/react-navigation-menu` → `import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"`.
  - `NavigationMenuViewport` rebuilt as `Portal > Positioner > Popup > Viewport`. CSS var renames: `--radix-navigation-menu-viewport-height`→`--popup-height`, `--radix-navigation-menu-viewport-width`→`--popup-width` (on the Popup).
  - `viewport` boolean prop is destructured out (dropped from Root, Base UI has no such prop) but still drives `data-viewport` + the conditional `<NavigationMenuViewport/>` render, preserving the wrapper API.
  - Trigger open state `data-[state=open]` → `data-[popup-open]` (cva `navigationMenuTriggerStyle` and the chevron `group-data-[popup-open]:rotate-180`).
  - `NavigationMenuLink` active state `data-[active=true]` → `data-[active]` (Base UI `active` prop emits presence `data-active`).
  - Motion animations (`data-[motion...]`, `animate-in/out`) rewritten to `transition-[opacity,transform] data-[starting-style]/[ending-style]:opacity-0` on Content/Popup.
  - `NavigationMenuIndicator`: Base UI has NO part that tracks the active trigger along the list (Radix's Indicator). Converted to an **inert visual passthrough** (plain `aria-hidden` div, same arrow markup) — it no longer auto-positions. FLAGGED.
- Consumer: `resources/js/components/app-header.tsx` uses only `NavigationMenu`/`NavigationMenuList`/`NavigationMenuItem`/`navigationMenuTriggerStyle` as a static desktop nav bar (no Trigger/Content/Viewport/Link/Indicator rendered) — no call-site changes needed.
- Leftover scan clean.

## Left alone

- The static nav-bar usage in `app-header.tsx` renders plain `<Link>`s styled with `navigationMenuTriggerStyle` — no popup behavior exercised.

## Behavior changes

- Directional slide-on-motion (`data-motion`) replaced with a simple fade/transform (Base UI exposes `data-activation-direction` instead; not wired to per-direction slides).
- `NavigationMenuIndicator` no longer tracks the active trigger (no Base UI equivalent). Unused by consumers.
- The Radix `viewport={false}` inline-dropdown styling path is retained as class strings but Base UI always uses the anchored Popup/Viewport model.

## Verify by hand

- Desktop header nav renders and links navigate (primary usage).
- If a trigger+content menu is added later: confirm popup opens under the trigger, chevron rotates, and the shared viewport animates.
