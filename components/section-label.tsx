import type { ReactNode } from "react";

// The mono section marker used on every page that has sections. The rule is
// part of the label rather than a separate `Separator` above it: in a design
// built out of hairlines, one line that carries the heading reads as structure,
// where a line plus a heading reads as two unrelated things.
export function SectionLabel({
    children,
    action,
}: {
    children: ReactNode;
    /** Optional trailing link, e.g. "all posts →". */
    action?: ReactNode;
}) {
    return (
        <div className="flex items-center gap-4">
            <h2 className="text-muted-foreground text-label tracking-label font-mono whitespace-nowrap uppercase">
                {children}
            </h2>
            <span className="bg-border h-px flex-1" aria-hidden="true" />
            {action}
        </div>
    );
}
