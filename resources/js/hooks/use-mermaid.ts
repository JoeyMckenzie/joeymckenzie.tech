import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import type { ResolvedAppearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { mermaidTheme } from '@/lib/mermaid-theme';

/**
 * Diagram source keyed by the node it was read from. A Map rather than a
 * Record because the keys are live DOM nodes, not strings.
 */
type SourceCache = Map<Element, string>;

/**
 * Put each node back to its diagram source.
 *
 * `mermaid.run()` replaces a node's `innerHTML` with rendered SVG and marks it
 * `data-processed`, so re-theming has to restore the source first. The first
 * sight of a node is the only chance to read it.
 */
function primeSources(nodes: HTMLElement[], sources: SourceCache): void {
    nodes.forEach((node) => {
        if (!sources.has(node)) {
            sources.set(node, node.textContent ?? '');
        }

        node.innerHTML = sources.get(node) ?? '';
        node.removeAttribute('data-processed');
    });
}

/** Load Mermaid on demand and render the given nodes at the current theme. */
async function renderDiagrams(
    nodes: HTMLElement[],
    sources: SourceCache,
    appearance: ResolvedAppearance,
    isCancelled: () => boolean,
): Promise<void> {
    // Dynamic on purpose: Mermaid is heavy and most posts have no diagram, so
    // it must not sit in the bundle every reader downloads. The specifier is
    // static; only the *timing* is deferred.
    const mermaid = (await import('mermaid')).default;

    if (isCancelled()) {
        return;
    }

    primeSources(nodes, sources);
    mermaid.initialize(mermaidTheme(appearance));

    await mermaid.run({ nodes });
}

/**
 * Render the Mermaid diagrams inside server-rendered post HTML.
 *
 * Re-runs when the HTML changes (the editor preview re-renders on every
 * keystroke) and when the colour scheme changes, because the diagram theme is
 * baked into the rendered SVG.
 */
export const useMermaid = (
    container: RefObject<HTMLElement | null>,
    html: string,
): void => {
    const sources = useRef<SourceCache>(new Map());
    const stashedFor = useRef<string | null>(null);
    const { resolvedAppearance } = useAppearance();

    useEffect(() => {
        const element = container.current;

        if (element === null) {
            return;
        }

        // New HTML means React replaced every child, so every key in the cache
        // is a detached node. Clearing beats pruning: the preview re-renders on
        // each keystroke, so the map would otherwise grow without bound, and no
        // source belonging to replaced markup can ever be wanted again.
        if (stashedFor.current !== html) {
            sources.current.clear();
            stashedFor.current = html;
        }

        const nodes = Array.from(
            element.querySelectorAll<HTMLElement>('.mermaid'),
        );

        if (nodes.length === 0) {
            return;
        }

        let cancelled = false;

        void renderDiagrams(
            nodes,
            sources.current,
            resolvedAppearance,
            () => cancelled,
        );

        return () => {
            cancelled = true;
        };
    }, [container, html, resolvedAppearance]);
};
