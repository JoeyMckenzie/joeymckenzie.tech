# project — Radix UI → Base UI (whole-project)

2026-07-29 · whole-project migration, transformation engine (legacy `new-york` shadcn style, files migrated in place) · **verdict: complete, green.**

## Scope

All 17 Radix-based ui wrappers migrated from `@radix-ui/react-*` to `@base-ui/react@1.6.0`, in dependency order (leaves → composites → sidebar), then app-code call sites swept. `@base-ui/react` installed via pnpm; all 13 `@radix-ui/*` packages removed.

## Why "engine, in place" (not golden-pair replay)

`components.json` style is `new-york` — a **legacy** style with no `base-new-york` counterpart in the shadcn registry. Per the skill, legacy styles use classification-only: the wrappers were transformed in place (primitives rewired, the project's exact Tailwind classes kept, mechanical data-attribute/CSS-var renames applied) rather than retargeted onto a `base-<style>` variant (which would have restyled the app).

## Dependency swap

- Added: `@base-ui/react@1.6.0`.
- Removed: `@radix-ui/react-{avatar,checkbox,collapsible,dialog,dropdown-menu,label,navigation-menu,select,separator,slot,toggle,toggle-group,tooltip}`.
- Package manager: **pnpm** (pnpm-lock.yaml). Lockfile updated by pnpm add/remove.

## App-code sweep (call sites outside components/ui)

- `asChild` → `render` (child moved into the `render` element): `app-header.tsx` (SheetTrigger, DropdownMenuTrigger), `app-sidebar.tsx`, `nav-footer.tsx`, `nav-main.tsx`, `nav-user.tsx` (SidebarMenuButton), `breadcrumbs.tsx` (BreadcrumbLink), `delete-user.tsx` + `passkey-item.tsx` (DialogTrigger/DialogClose/Button), `user-menu-content.tsx` (DropdownMenuItem), `layouts/settings/layout.tsx` (Button).
- `TooltipProvider delayDuration` → `delay`: `app.tsx`.
- CSS var `--radix-dropdown-menu-trigger-width` → `--anchor-width`: `nav-user.tsx`.
- Post-sweep grep: `rg "@radix|radix-ui|--radix|asChild|delayDuration"` over `resources/` (excluding none) → **zero hits**.

## Left alone (intentional)

- Non-Radix wrappers untouched: `sonner.tsx` (sonner), `input-otp.tsx` (input-otp). Plain-markup wrappers with no primitive: `card`, `alert`, `input`, `icon`, `skeleton`, `spinner`, `placeholder-pattern`.
- No PHP touched (frontend-only migration); Pint not run.

## Behavior deltas flagged (see per-component reports)

- checkbox: `disabled:*` → `data-disabled:*` (Base UI Root is a `<span>`; converted so the disabled visual works).
- dropdown-menu: Base UI Checkbox/Radio items default `closeOnClick={false}` (unused here); item highlight via `data-highlighted` not `:focus`.
- navigation-menu: `NavigationMenuIndicator` has no Base UI equivalent → inert passthrough; directional `data-motion` slides simplified to fade/transform.
- sidebar: menu-button `data-[state=open]` mapped to `data-[popup-open]` (menu-trigger case); revisit if ever used as a collapsible trigger.
- toggle-group / select: value/callback signatures widened (array value, `(value, eventDetails)`); no call sites affected.

## Verification vs baseline

- Baseline (before any change): `tsc --noEmit` exit 0.
- Final: `pnpm run types:check` exit **0**; `pnpm run build` (vite) exit **0**; `prettier` — changed files conform; `eslint` on app-code changed files — **0 errors** (`components/ui/**` is eslint-ignored by project config).

## What's left on Radix

- **0 wrappers remain on Radix.** (`rg -l "radix" resources/js/components/ui` → none.)

## Follow-up for the user (not done here)

- `components.json` `style` still reads `new-york`. Because there is no `base-new-york` registry variant, this was left as-is: a future `shadcn add <component>` will pull a **Radix** variant. Decide whether to switch styles or add components manually going forward. (Flagged, not changed.)
