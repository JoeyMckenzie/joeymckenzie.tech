import { Button as ButtonPrimitive } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors, radius } from "@/app/tokens.stylex";

// One button, one look. shadcn shipped six variants and nine sizes; the site
// renders exactly one of them -- the "clear filters" action in the blog empty
// state -- so the rest were variants nobody could see and nobody had checked.
// Add a variant here when a second look actually appears in a design.
const styles = stylex.create({
    button: {
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        height: 28,
        paddingInline: 10,
        borderRadius: `min(${radius.md}, 12px)`,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.input,
        backgroundColor: {
            default: `color-mix(in oklab, ${colors.input} 30%, transparent)`,
            ":hover": `color-mix(in oklab, ${colors.input} 50%, transparent)`,
        },
        color: colors.foreground,
        fontSize: "0.8rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        userSelect: "none",
        cursor: { default: "pointer", ":disabled": "not-allowed" },
        transitionProperty: "background-color, border-color, color",
        transitionDuration: "150ms",
        // Tailwind's `ring` is a box-shadow emulating an outline. This is the
        // outline it was emulating.
        outlineWidth: { default: 0, ":focus-visible": 3 },
        outlineStyle: "solid",
        outlineOffset: 1,
        outlineColor: `color-mix(in oklab, ${colors.ring} 50%, transparent)`,
        translate: { default: null, ":active": "0 1px" },
        opacity: { default: null, ":disabled": 0.5 },
        pointerEvents: { default: null, ":disabled": "none" },
    },
});

export function Button({
    style,
    ...props
}: Omit<ButtonPrimitive.Props, "style"> & {
    // Shadows the DOM `style` prop on purpose -- see the note in `badge.tsx`.
    style?: StyleXStyles;
}) {
    return (
        <ButtonPrimitive {...props} {...stylex.props(styles.button, style)} />
    );
}
