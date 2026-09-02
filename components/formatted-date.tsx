// `pubDate` is a bare `YYYY-MM-DD`, which `new Date()` reads as UTC midnight.
// Formatting in UTC keeps a post dated the 5th from rendering as the 4th for
// anyone west of Greenwich.
export function FormattedDate({
    date,
    className,
}: {
    date: string;
    className?: string;
}) {
    return (
        <time dateTime={date} className={className}>
            {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: "UTC",
            })}
        </time>
    );
}
