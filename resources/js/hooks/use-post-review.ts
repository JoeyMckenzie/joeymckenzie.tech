import { useHttp, usePage, usePoll } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { review as reviewPost } from '@/routes/admin/posts';
import type { PostReview, PostReviewStatus } from '@/types';

export type PostReviewState = {
    readonly review: PostReview;
    readonly reviewing: boolean;
    readonly error: string | null;
    readonly run: () => Promise<void>;
};

const FAILED = 'The review could not be completed. Your saved post is safe.';

const NEVER_REVIEWED: PostReview = {
    status: null,
    notes: [],
    reviewedAt: null,
    dispatchedAt: null,
    isStale: false,
};

const TERMINAL: ReadonlySet<PostReviewStatus> = new Set([
    'completed',
    'failed',
    'superseded',
]);

const isTerminal = (
    status: PostReviewStatus | null,
): status is PostReviewStatus => status !== null && TERMINAL.has(status);

/**
 * Dispatches a background post review and polls the `review` prop until the
 * job reaches a terminal status. A local optimistic `pending` covers the gap
 * between the dispatch 202 and the first poll tick; polling resumes on mount
 * when the server already reports an in-flight review (e.g. after a reload).
 *
 * Every dispatch bumps the server's `dispatchedAt`, which distinguishes a
 * terminal state produced by the review we just triggered from the stale
 * terminal still sitting on the page prop. Keying the stop on `dispatchedAt`
 * lets consecutive identical outcomes settle (failed -> failed,
 * superseded -> superseded), where a status/reviewedAt comparison could not:
 * neither carries a fresh timestamp on a repeat, so polling would never stop.
 */
export const usePostReview = (postId: number): PostReviewState => {
    const review =
        (usePage().props.review as PostReview | undefined) ?? NEVER_REVIEWED;
    const { post } = useHttp<Record<string, never>, unknown>({});
    const { start, stop } = usePoll(
        2500,
        { only: ['review'] },
        { mode: 'cancel', autoStart: false },
    );

    const [optimisticPending, setOptimisticPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * The `dispatchedAt` present when the current review was dispatched. A
     * terminal status still carrying this value is the stale pre-dispatch
     * result and must not stop polling; our fresh result carries a newer one.
     */
    const dispatchBaseline = useRef(review.dispatchedAt);

    const reviewing = optimisticPending || review.status === 'pending';

    useEffect(() => {
        if (!reviewing) {
            stop();

            return;
        }

        // While reviewing, stop only once the server reports a terminal status
        // for *our* dispatch — never the stale terminal still on the prop until
        // the first poll tick lands, told apart by its older `dispatchedAt`. A
        // resumed in-flight review (server status 'pending', no optimistic
        // bridge) keeps polling here and settles via `!reviewing` once it
        // leaves 'pending'.
        if (
            isTerminal(review.status) &&
            review.dispatchedAt !== dispatchBaseline.current
        ) {
            setOptimisticPending(false);
            stop();
        } else {
            start();
        }
    }, [review.status, review.dispatchedAt, reviewing, start, stop]);

    const run = useCallback(async (): Promise<void> => {
        setError(null);
        dispatchBaseline.current = review.dispatchedAt;

        try {
            await post(reviewPost.url({ post: postId }));
            setOptimisticPending(true);
        } catch {
            setError(FAILED);
            toast.error(FAILED);
        }
    }, [post, postId, review.dispatchedAt]);

    return {
        review: {
            ...review,
            status: optimisticPending ? 'pending' : review.status,
        },
        reviewing,
        error,
        run,
    };
};
