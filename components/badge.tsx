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
