import type { ReactNode } from 'react';

export function PostEditorHeader({
    path,
    title,
    description,
    action,
}: {
    path: string;
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <header className="flex flex-col gap-6 border-b border-hairline pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
                <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-subtle uppercase">
                    {path}
                </p>
                <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-prose sm:text-5xl">
                    {title}
                </h1>
                <div className="nocturne-sweep mt-4 w-32 rounded-full" />
                <p className="mt-4 max-w-2xl text-sm leading-6 text-subtle">
                    {description}
                </p>
            </div>

            {action && <div className="shrink-0 sm:pt-6">{action}</div>}
        </header>
    );
}
