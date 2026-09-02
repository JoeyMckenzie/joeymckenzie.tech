import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// The typography plugin's colour set has to be applied as utilities on the
// element. Collecting them into a `.prose` rule in `@layer components` and
// `@apply`-ing `prose-invert` there does not work: the plugin's own `.prose`
// rule lives in the utilities layer, which wins, so post bodies rendered
// gray-700 body text and near-black headings on a near-black background.
//
// `dark:prose-invert` rather than a bare `prose-invert` so this follows a
// theme toggle if one lands later. `<html>` always carries `dark` today.
export function Prose({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                "prose dark:prose-invert max-w-none",
                "prose-headings:font-heading prose-headings:tracking-tight",
                "prose-a:text-primary prose-a:underline-offset-4",
                // Post images render at their natural size, so anything
                // narrower than the column sat flush left. Preflight already
                // makes images `display: block`, so auto margins centre them.
                "prose-img:mx-auto",
                // shiki writes the tokyo-night background inline, so `pre`
                // only needs the frame around it.
                "prose-pre:rounded-lg prose-pre:border prose-pre:p-4",
                "prose-code:font-mono",
                className
            )}
        >
            {children}
        </div>
    );
}
