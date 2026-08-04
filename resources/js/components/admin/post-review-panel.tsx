import {
    CircleCheckIcon,
    MessageSquareTextIcon,
    RefreshCwIcon,
    TriangleAlertIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { PostReviewPanelProps } from '@/types';

const REVIEWED_AT = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

const reviewedAt = (value: string): string =>
    REVIEWED_AT.format(new Date(value));

export function PostReviewPanel({
    review,
    saving,
    reviewing,
    error,
    onRetry,
    doc,
    onApply,
}: PostReviewPanelProps & {
    doc: string;
    onApply: (excerpt: string, replacement: string) => boolean;
}) {
    // Which notes have had their rewrite applied, by index. Purely client-side;
    // the server's latest_review is never mutated (JOEY-18.3). The parent keys
    // this component on the review identity, so a fresh result remounts it and
    // discards these marks — no effect, no server round-trip.
    const [applied, setApplied] = useState<ReadonlySet<number>>(new Set());

    const busy = saving || reviewing;
    const failed = error !== null || review.status === 'failed';
    const superseded = review.status === 'superseded';
    const showNotes =
        !busy &&
        review.notes.length > 0 &&
        (review.status === 'completed' || failed || superseded);
    const showClean =
        !busy && review.status === 'completed' && review.notes.length === 0;
    const showNever = !busy && review.status === null;
    const showRetry = failed || superseded;

    return (
        <Card
            role="region"
            aria-labelledby="post-review-heading"
            aria-live="polite"
            className="max-h-[48rem] min-h-[40rem] min-w-0 gap-0 overflow-hidden rounded-md border-hairline bg-panel py-0"
            data-test="post-review-panel"
        >
            <CardHeader className="border-b border-hairline px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <h2
                        id="post-review-heading"
                        className="flex items-center gap-2 font-mono text-xs leading-none font-semibold tracking-[0.14em] uppercase"
                    >
                        <MessageSquareTextIcon aria-hidden />
                        Line review
                    </h2>

                    {review.isStale && <Badge variant="outline">Stale</Badge>}
                </div>

                <CardDescription className="leading-5">
                    {review.reviewedAt === null
                        ? 'Constructive notes on clarity, conciseness, flow, and tone.'
                        : `Reviewed ${reviewedAt(review.reviewedAt)}`}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
                {busy && (
                    <Alert>
                        <Spinner aria-hidden />
                        <AlertTitle>
                            {saving
                                ? 'Saving latest changes'
                                : 'Reviewing saved draft'}
                        </AlertTitle>
                        <AlertDescription>
                            {saving
                                ? 'The review starts after this revision is safely persisted.'
                                : 'The editor is reading the latest persisted revision.'}
                        </AlertDescription>
                    </Alert>
                )}

                {failed && (
                    <Alert variant="destructive">
                        <TriangleAlertIcon aria-hidden />
                        <AlertTitle>Review failed</AlertTitle>
                        <AlertDescription>
                            {error ??
                                'The review could not be completed. Please retry.'}
                        </AlertDescription>
                    </Alert>
                )}

                {superseded && (
                    <Alert>
                        <TriangleAlertIcon aria-hidden />
                        <AlertTitle>
                            Content changed while this review was running
                        </AlertTitle>
                        <AlertDescription>
                            Save and run another review to check the latest
                            revision.
                        </AlertDescription>
                    </Alert>
                )}

                {showNever && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
                        <MessageSquareTextIcon
                            className="size-7 text-subtle"
                            aria-hidden
                        />
                        <div className="grid gap-1">
                            <p className="text-sm font-medium text-prose">
                                Ready when your draft is
                            </p>
                            <p className="text-xs leading-5 text-subtle">
                                Review saves first, then reads only the post
                                body.
                            </p>
                        </div>
                    </div>
                )}

                {showClean && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
                        <CircleCheckIcon
                            className="size-8 text-iris"
                            aria-hidden
                        />
                        <div className="grid gap-1">
                            <p className="text-sm font-medium text-prose">
                                Reads clean
                            </p>
                            <p className="text-xs leading-5 text-subtle">
                                Nothing meaningful to flag in this revision.
                            </p>
                        </div>
                    </div>
                )}

                {showNotes &&
                    review.notes.map((note, index) => {
                        const isApplied = applied.has(index);
                        const canApply = doc.includes(note.excerpt);

                        const handleApply = (): void => {
                            if (note.replacement === undefined) {
                                return;
                            }

                            if (onApply(note.excerpt, note.replacement)) {
                                setApplied((previous) =>
                                    new Set(previous).add(index),
                                );
                            }
                        };

                        return (
                            <article
                                key={`${note.category}-${note.excerpt}-${index}`}
                                className="grid gap-3 rounded-md border border-hairline bg-canvas p-4"
                            >
                                <Badge variant="secondary">
                                    {note.category}
                                </Badge>

                                <blockquote className="border-l-2 border-iris pl-3 text-sm leading-6 text-prose italic">
                                    “{note.excerpt}”
                                </blockquote>

                                <div className="grid gap-1">
                                    <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-subtle uppercase">
                                        Why
                                    </p>
                                    <p className="text-sm leading-6 text-prose">
                                        {note.comment}
                                    </p>
                                </div>

                                <div className="grid gap-1">
                                    <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-iris uppercase">
                                        Try
                                    </p>
                                    <p className="text-sm leading-6 text-prose">
                                        {note.suggestion}
                                    </p>
                                </div>

                                {note.replacement !== undefined && (
                                    <div className="grid gap-2">
                                        <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-iris uppercase">
                                            Rewrite
                                        </p>

                                        <pre className="overflow-x-auto rounded-md border border-hairline bg-panel p-3 font-mono text-xs leading-6 whitespace-pre-wrap text-prose">
                                            {note.replacement}
                                        </pre>

                                        {isApplied ? (
                                            <p className="flex items-center gap-1.5 font-mono text-xs text-iris">
                                                <CircleCheckIcon
                                                    className="size-4"
                                                    aria-hidden
                                                />
                                                Applied
                                            </p>
                                        ) : canApply ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="justify-self-start"
                                                onClick={handleApply}
                                            >
                                                Apply
                                            </Button>
                                        ) : (
                                            <div className="grid gap-1">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="justify-self-start"
                                                    disabled
                                                >
                                                    Apply
                                                </Button>
                                                <p className="text-xs leading-5 text-subtle">
                                                    This passage has changed —
                                                    re-review to apply.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    })}
            </CardContent>

            {showRetry && (
                <CardFooter className="border-t border-hairline px-4 py-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={onRetry}
                    >
                        {busy ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <RefreshCwIcon
                                data-icon="inline-start"
                                aria-hidden
                            />
                        )}
                        Retry
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
