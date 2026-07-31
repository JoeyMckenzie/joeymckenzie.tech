import { useHttp } from '@inertiajs/react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { store as storeImage } from '@/routes/admin/posts/images';

export type PostImageUpload = {
    readonly upload: (file: File) => Promise<string | null>;
    readonly uploading: boolean;
    readonly progress: number | null;
};

type ImagePayload = { image: File | null; slug: string };
type ImageResponse = { url: string };

const FAILED = 'Image upload failed — nothing was inserted.';

/**
 * Uploads an inline post image to `admin.posts.images` (JOEY-5.2).
 *
 * `slug` buckets the object under `posts/{slug}/`; a blank slug lands in
 * `posts/drafts/` server-side, which is what an unsaved post wants. Resolves to
 * the stored URL, or to `null` for every failure — validation, throttling,
 * network — so the caller never has to catch. A dropped image is loud rather
 * than silent, hence the toast.
 */
export const usePostImageUpload = (slug: string): PostImageUpload => {
    // `TResponse` includes `undefined` on purpose: a 422 resolves the promise
    // with no body and reports through `onError` instead.
    const { setData, post, processing, progress } = useHttp<
        ImagePayload,
        ImageResponse | undefined
    >({ image: null, slug: '' });

    const upload = useCallback(
        async (file: File): Promise<string | null> => {
            setData({ image: file, slug });

            try {
                const response = await post(storeImage.url(), {
                    onError: (errors) => {
                        toast.error(
                            typeof errors.image === 'string'
                                ? errors.image
                                : FAILED,
                        );
                    },
                });

                if (response === undefined) {
                    return null;
                }

                return response.url;
            } catch {
                toast.error(FAILED);

                return null;
            }
        },
        [post, setData, slug],
    );

    return {
        upload,
        uploading: processing,
        progress: progress?.percentage ?? null,
    };
};
