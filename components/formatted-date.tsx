import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

// `pubDate` is a bare `YYYY-MM-DD`, which `new Date()` reads as UTC midnight.
// Formatting in UTC keeps a post dated the 5th from rendering as the 4th for
// anyone west of Greenwich.
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
