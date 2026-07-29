# breadcrumb

2026-07-29 · transformation engine (legacy `new-york` style) · Slot → useRender on BreadcrumbLink; clean.

## Changed

- `resources/js/components/ui/breadcrumb.tsx` — only `BreadcrumbLink` used Radix (`@radix-ui/react-slot`). Converted to `useRender` + `mergeProps` (`useRender.ComponentProps<"a">`, `render` prop, object literal cast `as React.ComponentProps<"a">`). All other parts (`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`) were already plain HTML — untouched.
- Consumer: `resources/js/components/breadcrumbs.tsx` — `<BreadcrumbLink asChild><Link/></BreadcrumbLink>` → `<BreadcrumbLink render={<Link>…</Link>} />`.
- Leftover scan clean.

## Left alone

- The non-Slot breadcrumb parts — pure markup, no Radix.

## Behavior changes

- None.

## Verify by hand

- Render breadcrumbs with ≥2 items; confirm links navigate and the last item shows as `BreadcrumbPage`.
