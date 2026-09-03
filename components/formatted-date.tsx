import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

// UTC on purpose: a bare `YYYY-MM-DD` shifts a day west of Greenwich otherwise.
export function FormattedDate({
    date,
    style,
}: {
    date: string;
    style?: StyleXStyles;
}) {
    return (
        <time dateTime={date} {...stylex.props(style)}>
            {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: "UTC",
            })}
        </time>
    );
}
