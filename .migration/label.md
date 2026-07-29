# label

2026-07-29 · transformation engine (legacy `new-york` style) · Radix Label has no Base UI counterpart → native `<label>`; clean.

## Changed

- `resources/js/components/ui/label.tsx` — removed `@radix-ui/react-label`; renders a native `<label>` (`React.ComponentProps<"label">`). All classes preserved verbatim, including `group-data-[disabled=true]:*` and `peer-disabled:*` (these are not Radix state tokens, so untouched). Radix's only behavioral extra (no text-selection on double click) is already covered by the existing `select-none` class.
- Leftover scan clean: no `radix-ui`/`@radix-ui` in the file.

## Left alone

- No consumer changes needed — `<Label htmlFor=…>` call sites are native `<label>` props and unchanged (`delete-user.tsx` etc.).

## Behavior changes

- None material. Native `<label>` htmlFor association is identical to Radix Label.

## Verify by hand

- Click a form label; focus should move to the associated control.
