import type { FormComponentRef } from '@inertiajs/core';
import { Form, Link } from '@inertiajs/react';
import { SparklesIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import { MarkdownEditor } from '@/components/admin/markdown-editor';
import { InputError } from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { usePostReview } from '@/hooks/use-post-review';
import { cn } from '@/lib/utils';
import { index as postsIndex } from '@/routes/admin/posts';
import type { AdminPostFormValues, PostStatus, TagOption } from '@/types';

const CREATE_NEW_TAG = '__create_new_tag__';

const FIELD_LABEL_CLASS =
    'font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase';

const CONTROL_CLASS =
    'border-hairline bg-panel text-prose placeholder:text-subtle/70 focus-visible:border-iris focus-visible:ring-iris/20';

const STATUS_OPTIONS: { value: PostStatus; label: string; hint: string }[] = [
    { value: 'draft', label: 'Draft', hint: 'Hidden from the public blog.' },
    { value: 'published', label: 'Published', hint: 'Live immediately.' },
    { value: 'scheduled', label: 'Scheduled', hint: 'Goes live on a date.' },
];

function PostFormSection({
    id,
    title,
    children,
    className,
}: {
    id: string;
    title: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            aria-labelledby={id}
            className={cn('flex w-full flex-col gap-8', className)}
        >
            <div className="border-b border-hairline pb-3">
                <h2
                    id={id}
                    className="font-mono text-xs tracking-[0.16em] text-subtle uppercase"
                >
                    {title}
                </h2>
            </div>

            {children}
        </section>
    );
}

/** Mirrors `Str::slug()` closely enough for a live preview of the URL. */
function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function PostForm({
    tags,
    post,
}: {
    tags: TagOption[];
    post?: AdminPostFormValues;
}) {
    const [title, setTitle] = useState(post?.title ?? '');
    const [slug, setSlug] = useState(post?.slug ?? '');
    const [slugIsManual, setSlugIsManual] = useState(false);
    const [status, setStatus] = useState<PostStatus>(post?.status ?? 'draft');
    const [tagSelection, setTagSelection] = useState(
        post ? String(post.tagId) : '',
    );
    const form = useRef<FormComponentRef>(null);
    const reviewAfterSave = useRef(false);
    const postReview = usePostReview(post?.id ?? 0);

    const requestReview = (): void => {
        if (post === undefined || form.current === null) {
            reviewAfterSave.current = false;

            return;
        }

        reviewAfterSave.current = true;
        form.current.submit();
    };

    const clearReviewIntent = (): void => {
        reviewAfterSave.current = false;
    };

    const reviewAfterSuccessfulSave = (): void => {
        if (!reviewAfterSave.current) {
            return;
        }

        reviewAfterSave.current = false;
        void postReview.run();
    };

    const handleTitleChange = (value: string) => {
        setTitle(value);

        if (!slugIsManual) {
            setSlug(slugify(value));
        }
    };

    const handleSlugChange = (value: string) => {
        setSlugIsManual(true);
        setSlug(value);
    };

    return (
        <Form
            ref={form}
            {...(post
                ? PostController.update.form({ post: post.id })
                : PostController.store.form())}
            options={{
                preserveScroll: true,
            }}
            onSuccess={reviewAfterSuccessfulSave}
            onError={clearReviewIntent}
            onCancel={clearReviewIntent}
            onFinish={clearReviewIntent}
            encType="multipart/form-data"
            className="relative flex flex-col gap-14"
        >
            {({ processing, errors }) => (
                <>
                    {/*
                     * Everything that isn't the writing surface lives up here in
                     * one consistent-width block: title hero, then a grid that
                     * fills the column so no field looks stranded. The editor is
                     * the full-width finale below.
                     */}
                    <PostFormSection id="story-section" title="Story">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="title"
                                className={FIELD_LABEL_CLASS}
                            >
                                Title
                            </Label>

                            <Input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(event) =>
                                    handleTitleChange(event.target.value)
                                }
                                required
                                maxLength={255}
                                aria-invalid={Boolean(errors.title)}
                                className="h-auto rounded-none border-0 border-b border-hairline bg-transparent px-0 py-3 font-display text-3xl font-medium tracking-tight text-prose shadow-none placeholder:text-subtle/50 focus-visible:border-iris focus-visible:ring-0 sm:text-4xl md:text-4xl"
                                placeholder="How I stopped worrying about N+1"
                            />

                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 md:items-start">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="slug"
                                    className={FIELD_LABEL_CLASS}
                                >
                                    Slug
                                </Label>

                                <Input
                                    id="slug"
                                    name="slug"
                                    value={slug}
                                    onChange={(event) =>
                                        handleSlugChange(event.target.value)
                                    }
                                    required
                                    maxLength={255}
                                    aria-invalid={Boolean(errors.slug)}
                                    className={cn(
                                        CONTROL_CLASS,
                                        'font-mono text-sm',
                                    )}
                                    placeholder="how-i-stopped-worrying-about-n-1"
                                />

                                <p className="text-xs leading-5 text-subtle">
                                    Public URL:{' '}
                                    <span className="font-mono text-prose">
                                        /blog/{slug || 'your-post'}
                                    </span>
                                </p>

                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="tag_selection"
                                    className={FIELD_LABEL_CLASS}
                                >
                                    Tag
                                </Label>

                                <Select
                                    name={
                                        tagSelection === CREATE_NEW_TAG
                                            ? undefined
                                            : 'tag_id'
                                    }
                                    value={tagSelection || null}
                                    onValueChange={(value) =>
                                        setTagSelection(value ?? '')
                                    }
                                    items={[
                                        ...tags.map((tag) => ({
                                            label: tag.name,
                                            value: String(tag.id),
                                        })),
                                        {
                                            label: 'Create a new tag…',
                                            value: CREATE_NEW_TAG,
                                        },
                                    ]}
                                    required
                                >
                                    <SelectTrigger
                                        id="tag_selection"
                                        aria-invalid={Boolean(
                                            errors.tag_name ?? errors.tag_id,
                                        )}
                                        className={cn(CONTROL_CLASS, 'w-full')}
                                    >
                                        <SelectValue placeholder="Pick a tag" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Existing tags
                                            </SelectLabel>

                                            {tags.map((tag) => (
                                                <SelectItem
                                                    key={tag.id}
                                                    value={String(tag.id)}
                                                >
                                                    {tag.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>

                                        <SelectSeparator />

                                        <SelectGroup>
                                            <SelectItem value={CREATE_NEW_TAG}>
                                                Create a new tag…
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {tagSelection === CREATE_NEW_TAG && (
                                    <div className="mt-2 grid gap-2 border-l border-iris pl-4">
                                        <Label
                                            htmlFor="tag_name"
                                            className={FIELD_LABEL_CLASS}
                                        >
                                            New tag name
                                        </Label>

                                        <Input
                                            id="tag_name"
                                            name="tag_name"
                                            required
                                            maxLength={255}
                                            aria-invalid={Boolean(
                                                errors.tag_name,
                                            )}
                                            className={CONTROL_CLASS}
                                            placeholder="laravel-tips"
                                        />

                                        <p className="text-xs leading-5 text-subtle">
                                            New names are saved as lowercase
                                            URL-safe slugs.
                                        </p>
                                    </div>
                                )}

                                <InputError
                                    message={errors.tag_name ?? errors.tag_id}
                                />
                            </div>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 md:items-start">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="description"
                                    className={FIELD_LABEL_CLASS}
                                >
                                    Description
                                </Label>

                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={post?.description}
                                    required
                                    rows={5}
                                    maxLength={1000}
                                    aria-invalid={Boolean(errors.description)}
                                    className={CONTROL_CLASS}
                                    placeholder="One or two sentences for listings and social cards."
                                />

                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="cover"
                                    className={FIELD_LABEL_CLASS}
                                >
                                    Cover image
                                </Label>

                                {post?.cover && (
                                    <div className="flex flex-col gap-4 rounded-md border border-hairline bg-panel p-4 sm:flex-row sm:items-center">
                                        <img
                                            src={post.cover}
                                            alt={`Current cover for ${post.title}`}
                                            className="h-24 w-full rounded-md border border-hairline object-cover sm:w-40"
                                        />

                                        <p className="text-sm leading-6 text-subtle">
                                            Current cover. Uploading a new image
                                            replaces this plate; leave the field
                                            empty to keep it.
                                        </p>
                                    </div>
                                )}

                                <Input
                                    id="cover"
                                    type="file"
                                    name="cover"
                                    accept="image/*"
                                    aria-invalid={Boolean(errors.cover)}
                                    className={CONTROL_CLASS}
                                />

                                <InputError message={errors.cover} />
                            </div>
                        </div>
                    </PostFormSection>

                    <PostFormSection id="publishing-section" title="Publishing">
                        <fieldset className="grid gap-3">
                            <legend className={FIELD_LABEL_CLASS}>
                                Status
                            </legend>

                            <div className="grid gap-2 sm:grid-cols-3">
                                {STATUS_OPTIONS.map((option) => (
                                    <Label
                                        key={option.value}
                                        htmlFor={`status-${option.value}`}
                                        className="flex cursor-pointer items-start gap-3 rounded-md border border-hairline bg-panel p-3 text-prose transition-colors focus-within:border-iris focus-within:ring-2 focus-within:ring-iris/20 has-checked:border-iris has-checked:bg-iris/10"
                                    >
                                        <input
                                            id={`status-${option.value}`}
                                            type="radio"
                                            name="status"
                                            value={option.value}
                                            defaultChecked={
                                                option.value ===
                                                (post?.status ?? 'draft')
                                            }
                                            onChange={() =>
                                                setStatus(option.value)
                                            }
                                            aria-invalid={Boolean(
                                                errors.status,
                                            )}
                                            className="mt-0.5 size-4 accent-iris"
                                        />

                                        <span className="grid gap-1">
                                            <span className="font-mono text-xs tracking-wide uppercase">
                                                {option.label}
                                            </span>

                                            <span className="text-xs leading-5 font-normal text-subtle">
                                                {option.hint}
                                            </span>
                                        </span>
                                    </Label>
                                ))}
                            </div>

                            <InputError message={errors.status} />
                        </fieldset>

                        {status === 'scheduled' && (
                            <div className="grid gap-2 border-l border-iris pl-4">
                                <Label
                                    htmlFor="published_at"
                                    className={FIELD_LABEL_CLASS}
                                >
                                    Publish at
                                </Label>

                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    name="published_at"
                                    defaultValue={post?.publishedAt ?? ''}
                                    required
                                    aria-invalid={Boolean(errors.published_at)}
                                    className={cn(CONTROL_CLASS, 'sm:max-w-xs')}
                                />

                                <p className="text-xs leading-5 text-subtle">
                                    Scheduling requires a date and time in the
                                    future.
                                </p>

                                <InputError message={errors.published_at} />
                            </div>
                        )}
                    </PostFormSection>

                    {/*
                     * The writing surface is the finale: full width, taller than
                     * the fields above, so it reads as the destination rather
                     * than something wedged between settings.
                     */}
                    <PostFormSection id="content-section" title="Content">
                        <div className="grid gap-2">
                            {/* CodeMirror owns the input, so nothing to point at. */}
                            <Label className={FIELD_LABEL_CLASS}>
                                Content (markdown)
                            </Label>

                            <MarkdownEditor
                                name="content"
                                defaultValue={post?.content}
                                slug={slug}
                                review={
                                    post === undefined
                                        ? undefined
                                        : {
                                              review: postReview.review,
                                              saving:
                                                  processing &&
                                                  reviewAfterSave.current,
                                              reviewing: postReview.reviewing,
                                              error: postReview.error,
                                              onRetry: requestReview,
                                          }
                                }
                            />

                            <InputError message={errors.content} />
                        </div>
                    </PostFormSection>

                    <div
                        className="sticky bottom-3 z-10 flex w-full flex-wrap items-center gap-3 rounded-md border border-hairline bg-panel/95 px-3 py-2 shadow-sm backdrop-blur"
                        aria-label="Post actions"
                    >
                        <span
                            className="rounded-sm border border-iris/20 bg-iris/10 px-2 py-1 font-mono text-[0.6875rem] font-medium tracking-[0.12em] text-iris uppercase"
                            data-test="post-status-indicator"
                        >
                            {status}
                        </span>

                        <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2">
                            {post !== undefined && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        processing || postReview.reviewing
                                    }
                                    onClick={requestReview}
                                    data-test="review-post-button"
                                >
                                    {postReview.reviewing ? (
                                        <Spinner data-icon="inline-start" />
                                    ) : (
                                        <SparklesIcon
                                            data-icon="inline-start"
                                            aria-hidden
                                        />
                                    )}
                                    {postReview.reviewing
                                        ? 'Reviewing…'
                                        : processing && reviewAfterSave.current
                                          ? 'Saving…'
                                          : 'Review'}
                                </Button>
                            )}

                            <Button
                                type="submit"
                                disabled={processing || postReview.reviewing}
                                className="bg-iris text-canvas hover:bg-iris/90"
                                data-test="save-post-button"
                            >
                                {post ? 'Save changes' : 'Create post'}
                            </Button>

                            <Button
                                variant="ghost"
                                className="text-subtle hover:bg-canvas hover:text-prose"
                                nativeButton={false}
                                render={<Link href={postsIndex()}>Cancel</Link>}
                            />
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}
