export function PageHeader({
    heading,
    intro,
    updated,
    updatedLabel,
}: {
    heading: string;
    intro?: string;
    updated?: string;
    updatedLabel?: string;
}) {
    return (
        <header>
            <h1 className="font-heading text-4xl font-semibold tracking-tight">
                {heading}
            </h1>
            {updated && (
                <time
                    className="text-muted-foreground mt-2 block font-mono text-xs tracking-wider"
                    dateTime={updated}
                >
                    {updatedLabel}
                </time>
            )}
            {intro && (
                <p className="text-muted-foreground mt-5 max-w-xl">{intro}</p>
            )}
        </header>
    );
}
