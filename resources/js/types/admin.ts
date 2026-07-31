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
