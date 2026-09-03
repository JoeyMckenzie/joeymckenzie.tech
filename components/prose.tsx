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
                // `prose-invert` ships a cool gray ramp -- body copy came out
                // #d1d5dc against a warm #0e0d0c canvas, which read as a
                // different design from the rest of the page. Pointing the
                // plugin's own variables at the palette tokens fixes every
                // element it styles at once, rather than chasing them with
                // per-element `prose-*` overrides. Same reason as the note
                // above for why these are utilities and not a CSS rule.
                "[--tw-prose-invert-body:var(--color-foreground)]",
                "[--tw-prose-invert-headings:#fff]",
                "[--tw-prose-invert-bold:#fff]",
                "[--tw-prose-invert-lead:var(--color-muted-foreground)]",
                "[--tw-prose-invert-links:var(--color-primary)]",
                "[--tw-prose-invert-counters:var(--color-muted-foreground)]",
                "[--tw-prose-invert-bullets:var(--color-muted-foreground)]",
                "[--tw-prose-invert-captions:var(--color-muted-foreground)]",
                "[--tw-prose-invert-quotes:var(--color-foreground)]",
                "[--tw-prose-invert-quote-borders:var(--color-primary)]",
                "[--tw-prose-invert-hr:var(--color-border)]",
                "[--tw-prose-invert-th-borders:var(--color-border)]",
                "[--tw-prose-invert-td-borders:var(--color-border)]",
                "prose-headings:font-heading prose-headings:tracking-tight",
                "prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/40 hover:prose-a:decoration-primary",
                // Post images render at their natural size, so anything
                // narrower than the column sat flush left. Preflight already
                // makes images `display: block`, so auto margins centre them.
                "prose-img:mx-auto prose-img:rounded-lg",
                // shiki writes the tokyo-night background inline, so `pre`
                // only needs the frame around it.
                "prose-pre:rounded-lg prose-pre:border prose-pre:p-4",
                "prose-code:font-mono",
                // Deliberately not `prose-code:`, which the plugin resolves to
                // every `code` including the ones inside `pre` -- that would
                // draw a chip around each line of a highlighted block. This
                // variant reaches inline code only.
                "[&_:not(pre)>code]:bg-secondary [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:border",
                "[&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5",
                "[&_:not(pre)>code]:text-[0.875em] [&_:not(pre)>code]:font-normal",
                // The plugin wraps inline code in literal backticks, which
                // double up once the chip above gives it its own boundary.
                "[&_:not(pre)>code]:before:content-none [&_:not(pre)>code]:after:content-none",
                className
            )}
        >
            {children}
        </div>
    );
}
