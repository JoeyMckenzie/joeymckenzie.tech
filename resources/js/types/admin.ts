/**
 * Shapes the authed admin post CRUD surface consumes (JOEY-5.1).
 *
 * These mirror `App\Http\Controllers\Admin\PostController` exactly:
 * `AdminPostRow` is one entry of the `posts` prop on the index page,
 * `AdminPostFormValues` is the `post` prop on the edit page. Labels are
 * pre-formatted server-side; `publishedAt` is already `Y-m-d\TH:i` so it
 * drops straight into an `<input type="datetime-local">`.
 */
export type PostStatus = 'draft' | 'published' | 'scheduled';
export type PostReviewCategory = 'Clarity' | 'Conciseness' | 'Flow' | 'Tone';
export type PostReviewStatus =
    'pending' | 'completed' | 'failed' | 'superseded';

export type PostReviewNote = {
    category: PostReviewCategory;
    excerpt: string;
    comment: string;
    suggestion: string;
    /**
     * A verbatim drop-in rewrite for `excerpt`, present only for precise,
     * localized notes. Absent notes render advice-only, so legacy persisted
     * reviews without the key keep working (JOEY-18.3).
     */
    replacement?: string;
};

export type PostReview = {
    status: PostReviewStatus | null;
    notes: PostReviewNote[];
    reviewedAt: string | null;
    dispatchedAt: string | null;
    isStale: boolean;
};

/**
 * The review data `PostForm` threads down into `MarkdownEditor`, which owns the
 * `PostReviewPanel` so apply/match-detection sit beside the editor `doc` and
 * `view` (JOEY-18.3). The editor injects `doc` and `onApply` on top of these.
 */
export type PostReviewPanelProps = {
    review: PostReview;
    saving: boolean;
    reviewing: boolean;
    error: string | null;
    onRetry: () => void;
};

export type AdminPostRow = {
    id: number;
    title: string;
    slug: string;
    tag: string;
    status: PostStatus;
    publishedLabel: string | null;
    readingMinutes: number;
    views: number;
    updatedLabel: string | null;
};

export type AdminPostFormValues = {
    id: number;
    title: string;
    slug: string;
    description: string;
    tagId: number;
    content: string;
    cover: string | null;
    status: PostStatus;
    publishedAt: string | null;
    views: number;
};

export type TagOption = {
    id: number;
    name: string;
};
