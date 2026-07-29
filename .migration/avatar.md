# avatar

2026-07-29 · transformation engine (legacy `new-york` style) · direct 1:1; clean.

## Changed

- `resources/js/components/ui/avatar.tsx` — `@radix-ui/react-avatar` (namespace import) → `import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"`. `Root`/`Image`/`Fallback` map 1:1; props retyped to `AvatarPrimitive.Root.Props` / `.Image.Props` / `.Fallback.Props`. Classes unchanged.
- Leftover scan clean.

## Left alone

- Consumer `app-header.tsx` uses `Avatar`/`AvatarImage`/`AvatarFallback` with `src`/`alt`/`className` only — no prop changes. (`delayMs` → `delay` on Fallback was not used anywhere.)

## Behavior changes

- None. If any call site later needs the fallback delay, note Radix `delayMs` is now `delay`.

## Verify by hand

- Load a user with a broken/empty avatar URL; confirm initials fallback still shows.
