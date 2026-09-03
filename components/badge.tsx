import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors, fonts, radius, text, tracking } from "@/app/tokens.stylex";

const styles = stylex.create({
    base: {
        display: "inline-flex",
        height: 20,
        width: "fit-content",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        borderRadius: radius.xl4,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "transparent",
        paddingInline: 8,
        paddingBlock: 2,
        fontSize: "0.75rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        textDecoration: "none",
        transitionProperty: "background-color, color, border-color",
        transitionDuration: "150ms",
    },
    solid: {
        backgroundColor: colors.primary,
        color: colors.primaryForeground,
    },
    outline: {
        borderColor: colors.border,
        color: colors.foreground,
    },
    // Hover belongs to the element the badge renders *as*, not to the badge.
    // shadcn scoped it with an `[a]:hover:` variant so a plain informational
    // chip would not light up under the pointer; StyleX cannot generate that
    // selector, and it does not need to -- a badge is interactive exactly when
    // a caller hands it something interactive to render as.
    solidInteractive: {
        cursor: "pointer",
        backgroundColor: {
            default: colors.primary,
            ":hover": `color-mix(in oklab, ${colors.primary} 80%, transparent)`,
        },
    },
    outlineInteractive: {
        cursor: "pointer",
        backgroundColor: { default: null, ":hover": colors.muted },
        color: { default: colors.foreground, ":hover": colors.mutedForeground },
    },
});

// Tag chips on the blog index, the post cards and the post pages are the same
// object -- a mono, uppercase, label-sized chip -- so the three call sites
// share one definition rather than repeating four utilities each.
export const badgeStyles = stylex.create({
    tag: {
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
    },
});

export function Badge({
    variant = "outline",
    style,
    render,
    ...props
}: Omit<useRender.ComponentProps<"span">, "style"> & {
    variant?: "solid" | "outline";
    // Shadows the DOM `style` prop on purpose. An element carrying a
    // `stylex.props()` spread must not also receive a `style` or `className`,
    // so the only styling a caller can pass is StyleX styles.
    style?: StyleXStyles;
}) {
    const interactive = render != null;

    return useRender({
        defaultTagName: "span",
        props: mergeProps<"span">(
            stylex.props(
                styles.base,
                variant === "solid" ? styles.solid : styles.outline,
                interactive &&
                    (variant === "solid"
                        ? styles.solidInteractive
                        : styles.outlineInteractive),
                style
            ),
            props
        ),
        render,
    });
}
