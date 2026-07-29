# collapsible

2026-07-29 · transformation engine (legacy `new-york` style) · direct, Content→Panel; clean.

## Changed

- `resources/js/components/ui/collapsible.tsx` — `@radix-ui/react-collapsible` → `import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"`. `Root`→`Root`, `CollapsibleTrigger`→`Trigger`, `CollapsibleContent`→`Panel` (public wrapper names `Collapsible`/`CollapsibleTrigger`/`CollapsibleContent` unchanged). Props retyped to `.Root.Props`/`.Trigger.Props`/`.Panel.Props`. No classes on these wrappers to rewrite.
- Leftover scan clean.

## Left alone

- No app-code consumers of collapsible found; nothing to sweep.

## Behavior changes

- If any consumer animates height, note the CSS var is now `--collapsible-panel-height` and state hooks are `data-open`/`data-closed` on the Panel (`data-panel-open` on the Trigger). No such usage exists here.

## Verify by hand

- Expand/collapse a collapsible; content shows/hides.
