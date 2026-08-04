import {
    CircleCheckIcon,
    MessageSquareTextIcon,
    RefreshCwIcon,
    TriangleAlertIcon,
} from 'lucide-react';
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
import type { PostReview } from '@/types';

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
}: {
    review: PostReview | null;
    saving: boolean;
    reviewing: boolean;
    error: string | null;
    onRetry: () => void;
}) {
    const busy = saving || reviewing;

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

                    {review?.isStale === true && (
                        <Badge variant="outline">Stale</Badge>
                    )}
                </div>

                <CardDescription className="leading-5">
                    {review === null
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

                {error !== null && (
                    <Alert variant="destructive">
                        <TriangleAlertIcon aria-hidden />
                        <AlertTitle>Review failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {review?.isStale === true && (
                    <Alert>
                        <TriangleAlertIcon aria-hidden />
                        <AlertTitle>
                            Content changed since this review
                        </AlertTitle>
                        <AlertDescription>
                            Run another review to check the saved revision.
                        </AlertDescription>
                    </Alert>
                )}

                {!busy && error === null && review === null && (
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

                {review !== null && review.notes.length === 0 && (
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

                {review?.notes.map((note, index) => (
                    <article
                        key={`${note.category}-${note.excerpt}-${index}`}
                        className="grid gap-3 rounded-md border border-hairline bg-canvas p-4"
                    >
                        <Badge variant="secondary">{note.category}</Badge>

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
                    </article>
                ))}
            </CardContent>

            {error !== null && (
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
