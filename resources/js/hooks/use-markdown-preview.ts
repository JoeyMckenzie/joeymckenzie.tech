import { useHttp } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { preview } from '@/routes/admin/posts';

export type MarkdownPreview = {
    readonly html: string;
    readonly processing: boolean;
};

type PreviewPayload = { content: string };
type PreviewResponse = { html: string };

const DEBOUNCE_MS = 400;

/**
 * Debounced server-side markdown preview (JOEY-5.2).
 *
 * Posts the buffer to `admin.posts.preview`, which runs the *same*
 * `MarkdownRenderer` the save path uses, so the HTML that comes back is the HTML
 * the published article will have — ADR 0004. Every failure is absorbed: the
 * hook keeps the last good render rather than handing the UI an error branch.
 *
 * `initialHtml` seeds the first paint for a caller that already holds rendered
 * HTML. The admin edit page does not — its `post` prop carries `content` only —
 * so it passes nothing and the immediate first request fills the pane.
 */
export const useMarkdownPreview = (
    markdown: string,
    initialHtml = '',
): MarkdownPreview => {
    const settled = useDebouncedValue(markdown.trim(), DEBOUNCE_MS);
    const { setData, post, processing, cancel } = useHttp<
        PreviewPayload,
        PreviewResponse
    >({ content: '' });
    const [html, setHtml] = useState(initialHtml);
    const blank = settled === '';

    useEffect(() => {
        if (blank) {
            return;
        }

        let superseded = false;

        setData('content', settled);

        void post(preview.url(), {
            onSuccess: (response) => {
                if (superseded) {
                    return;
                }

                setHtml(response.html);
            },
        }).catch((error: unknown) => {
            // The last good render stays on screen, which is the right outcome
            // for a cancelled, failed or 5xx preview alike — but a silent catch
            // would hide a genuinely broken endpoint, so say so.
            console.error('Markdown preview failed to render', error);
        });

        return () => {
            superseded = true;
            // Drop a render for a buffer the operator has already moved past,
            // so responses can never land out of order.
            cancel();
        };
    }, [blank, cancel, post, setData, settled]);

    // An empty buffer settles to an empty preview with no round trip: the
    // endpoint would only hand an empty string back.
    return { html: blank ? '' : html, processing };
};
