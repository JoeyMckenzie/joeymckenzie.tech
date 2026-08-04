import { useHttp } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { review as reviewPost } from '@/routes/admin/posts';
import type { PostReview } from '@/types';

export type PostReviewState = {
    readonly review: PostReview | null;
    readonly reviewing: boolean;
    readonly error: string | null;
    readonly run: () => Promise<void>;
};

type ReviewResponse = { review: PostReview };
type ReviewDisplay = {
    serverReview: PostReview | null;
    visibleReview: PostReview | null;
};

const FAILED = 'The review could not be completed. Your saved post is safe.';

/** Runs a persisted post review and retains the last successful result. */
export const usePostReview = (
    postId: number,
    initialReview: PostReview | null,
): PostReviewState => {
    const { post, processing } = useHttp<Record<string, never>, ReviewResponse>(
        {},
    );
    const [reviewDisplay, setReviewDisplay] = useState<ReviewDisplay>({
        serverReview: initialReview,
        visibleReview: initialReview,
    });
    const [error, setError] = useState<string | null>(null);

    if (reviewDisplay.serverReview !== initialReview) {
        setReviewDisplay({
            serverReview: initialReview,
            visibleReview: initialReview,
        });
    }

    const run = useCallback(async (): Promise<void> => {
        setError(null);

        try {
            const response = await post(reviewPost.url({ post: postId }));

            setReviewDisplay((current) => ({
                ...current,
                visibleReview: response.review,
            }));
        } catch {
            setError(FAILED);
            toast.error(FAILED);
        }
    }, [post, postId]);

    return {
        review: reviewDisplay.visibleReview,
        reviewing: processing,
        error,
        run,
    };
};
