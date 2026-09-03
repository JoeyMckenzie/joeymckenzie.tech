import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";

// Every route renders the same column. It was seven copies of the same six
// utilities; it is one component now.
const styles = stylex.create({
    main: {
        marginInline: "auto",
        width: "100%",
        maxWidth: "48rem",
        paddingInline: 16,
        paddingTop: 80,
        paddingBottom: 96,
    },
});

export function Main({
    children,
    style,
}: {
    children: ReactNode;
    style?: StyleXStyles;
}) {
    return <main {...stylex.props(styles.main, style)}>{children}</main>;
}
