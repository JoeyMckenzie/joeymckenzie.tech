import { useRef } from 'react';
import { useMermaid } from '@/hooks/use-mermaid';
import { cn } from '@/lib/utils';

/**
 * Server-rendered post HTML (Phiki-highlighted code, Mermaid fences) inside the
 * Nocturne article prose, plus the client-side Mermaid pass it needs.
 *
 * Shared by the public post page (JOEY-4.3) and the admin editor preview
 * (JOEY-5.2). One copy is the point: the preview is byte-identical to the
 * published article only while both use the same markup and the same diagram
 * lifecycle, and a second copy of either would quietly drift.
 */
export function RenderedMarkdown({
    html,
    className,
}: {
    html: string;
    className?: string;
}) {
    const article = useRef<HTMLElement>(null);

    useMermaid(article, html);

    return (
        <article
            ref={article}
            className={cn('prose-nocturne', className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
