import { Input as InputPrimitive } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { SearchIcon } from "lucide-react";

import { colors, fonts, radius, text } from "@/app/tokens.stylex";

const styles = stylex.create({
    group: {
        position: "relative",
        display: "flex",
        height: 32,
        width: "100%",
        minWidth: 0,
        alignItems: "center",
        gap: 8,
        paddingInline: 8,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: { default: colors.input, ":focus-within": colors.ring },
        backgroundColor: `color-mix(in oklab, ${colors.input} 30%, transparent)`,
        outlineWidth: { default: 0, ":focus-within": 3 },
        outlineStyle: "solid",
        outlineColor: `color-mix(in oklab, ${colors.ring} 50%, transparent)`,
        transitionProperty: "border-color",
        transitionDuration: "150ms",
    },
    icon: {
        flexShrink: 0,
        color: colors.mutedForeground,
    },
    hint: {
        flexShrink: 0,
        // Absent, not just invisible, where there is no physical keyboard to
        // press it on -- an unusable key cap should not take up the space.
        display: {
            default: "none",
            "@media (hover: hover) and (pointer: fine)": "grid",
        },
        placeItems: "center",
        minWidth: 18,
        height: 18,
        paddingInline: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
    },
    input: {
        flex: "1",
        minWidth: 0,
        height: "100%",
        borderStyle: "none",
        backgroundColor: "transparent",
        color: colors.foreground,
        fontSize: "0.875rem",
        outlineStyle: "none",
        "::placeholder": { color: colors.mutedForeground },
        // Safari paints its own clear button on `type="search"`.
        "::-webkit-search-cancel-button": { display: "none" },
    },
});

export function SearchInput({
    style,
    hint,
    ...props
}: Omit<InputPrimitive.Props, "style"> & {
    style?: StyleXStyles;
    hint?: string;
}) {
    return (
        <div {...stylex.props(styles.group, style)}>
            <SearchIcon size={16} {...stylex.props(styles.icon)} />
            <InputPrimitive {...props} {...stylex.props(styles.input)} />
            {hint && (
                <kbd aria-hidden="true" {...stylex.props(styles.hint)}>
                    {hint}
                </kbd>
            )}
        </div>
    );
}
