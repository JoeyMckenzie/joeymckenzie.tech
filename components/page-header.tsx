import { revealDelay } from "@/components/reveal";

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
            <h1
                className="font-heading text-display reveal font-semibold"
                style={revealDelay(0)}
            >
                {heading}
                <span className="text-primary">.</span>
            </h1>
            {updated && (
                <time
                    className="text-muted-foreground text-label tracking-label reveal mt-5 block font-mono uppercase"
                    style={revealDelay(1)}
                    dateTime={updated}
                >
                    {updatedLabel}
                </time>
            )}
            {intro && (
                <p
                    className="text-muted-foreground reveal mt-6 max-w-xl leading-relaxed"
                    style={revealDelay(2)}
                >
                    {intro}
                </p>
            )}
        </header>
    );
}
