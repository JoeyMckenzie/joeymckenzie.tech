import { Input as InputPrimitive } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { SearchIcon } from "lucide-react";

import { colors, radius } from "@/app/tokens.stylex";

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
    ...props
}: Omit<InputPrimitive.Props, "style"> & {
    style?: StyleXStyles;
}) {
    return (
        <div {...stylex.props(styles.group, style)}>
            <SearchIcon size={16} {...stylex.props(styles.icon)} />
            <InputPrimitive {...props} {...stylex.props(styles.input)} />
        </div>
    );
}
