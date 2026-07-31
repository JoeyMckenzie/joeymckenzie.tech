import { Form, Link } from '@inertiajs/react';
import { useState } from 'react';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import { InputError } from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index as postsIndex } from '@/routes/admin/posts';
import type { AdminPostFormValues, PostStatus, TagOption } from '@/types';

const STATUS_OPTIONS: { value: PostStatus; label: string; hint: string }[] = [
    { value: 'draft', label: 'Draft', hint: 'Hidden from the public blog.' },
    { value: 'published', label: 'Published', hint: 'Live immediately.' },
    { value: 'scheduled', label: 'Scheduled', hint: 'Goes live on a date.' },
];

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
    // An existing post starts locked: its URL is already out in the world.
    const [slugLocked, setSlugLocked] = useState(post !== undefined);
    const [status, setStatus] = useState<PostStatus>(post?.status ?? 'draft');

    const handleTitleChange = (value: string) => {
        setTitle(value);

        if (!slugLocked) {
            setSlug(slugify(value));
        }
    };

    const handleSlugChange = (value: string) => {
        setSlugLocked(true);
        setSlug(value);
    };

    return (
        <Form
            {...(post
                ? PostController.update.form({ post: post.id })
                : PostController.store.form())}
            options={{
                preserveScroll: true,
            }}
            encType="multipart/form-data"
            className="space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>

                        <Input
                            id="title"
                            name="title"
                            value={title}
                            onChange={(event) =>
                                handleTitleChange(event.target.value)
                            }
                            required
                            maxLength={255}
                            placeholder="How I stopped worrying about N+1"
                        />

                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>

                        <Input
                            id="slug"
                            name="slug"
                            value={slug}
                            onChange={(event) =>
                                handleSlugChange(event.target.value)
                            }
                            required
                            maxLength={255}
                            className="font-mono text-sm"
                            placeholder="how-i-stopped-worrying-about-n-1"
                        />

                        <p className="text-sm text-muted-foreground">
                            Public URL:{' '}
                            <span className="font-mono">
                                /blog/{slug || 'your-post'}
                            </span>
                        </p>

                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>

                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={post?.description}
                            required
                            rows={3}
                            maxLength={1000}
                            placeholder="One or two sentences for listings and social cards."
                        />

                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tag_id">Tag</Label>

                        <Select
                            name="tag_id"
                            defaultValue={post?.tagId}
                            items={tags.map((tag) => ({
                                label: tag.name,
                                value: tag.id,
                            }))}
                            required
                        >
                            <SelectTrigger id="tag_id" className="w-full">
                                <SelectValue placeholder="Pick a tag" />
                            </SelectTrigger>

                            <SelectContent>
                                {tags.map((tag) => (
                                    <SelectItem key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError message={errors.tag_id} />
                    </div>

                    {/* JOEY-5.2 swaps this single field for CodeMirror. */}
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content (markdown)</Label>

                        <Textarea
                            id="content"
                            name="content"
                            defaultValue={post?.content}
                            required
                            rows={20}
                            className="font-mono text-sm"
                            spellCheck={false}
                            placeholder="## Heading"
                        />

                        <p className="text-sm text-muted-foreground">
                            Plain markdown for now — the rich editor and live
                            preview arrive with JOEY-5.2.
                        </p>

                        <InputError message={errors.content} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cover">Cover image</Label>

                        {post?.cover && (
                            <>
                                <img
                                    src={post.cover}
                                    alt={`Current cover for ${post.title}`}
                                    className="h-32 w-auto rounded-md border border-border object-cover"
                                />

                                <p className="text-sm text-muted-foreground">
                                    Uploading a new image replaces this one.
                                    Leave the field empty to keep it.
                                </p>
                            </>
                        )}

                        <Input
                            id="cover"
                            type="file"
                            name="cover"
                            accept="image/*"
                        />

                        <InputError message={errors.cover} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Status</Label>

                        <div className="grid gap-2 sm:grid-cols-3">
                            {STATUS_OPTIONS.map((option) => (
                                <Label
                                    key={option.value}
                                    htmlFor={`status-${option.value}`}
                                    className="flex items-start gap-3 rounded-md border border-border p-3 has-checked:border-ring has-checked:bg-muted"
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
                                        onChange={() => setStatus(option.value)}
                                        className="mt-0.5"
                                    />

                                    <span className="grid gap-1">
                                        <span>{option.label}</span>

                                        <span className="text-xs font-normal text-muted-foreground">
                                            {option.hint}
                                        </span>
                                    </span>
                                </Label>
                            ))}
                        </div>

                        <InputError message={errors.status} />
                    </div>

                    {status === 'scheduled' && (
                        <div className="grid gap-2">
                            <Label htmlFor="published_at">Publish at</Label>

                            <Input
                                id="published_at"
                                type="datetime-local"
                                name="published_at"
                                defaultValue={post?.publishedAt ?? ''}
                                required
                            />

                            <p className="text-sm text-muted-foreground">
                                Scheduling requires a date and time in the
                                future.
                            </p>

                            <InputError message={errors.published_at} />
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="save-post-button"
                        >
                            {post ? 'Save changes' : 'Create post'}
                        </Button>

                        <Button
                            variant="secondary"
                            nativeButton={false}
                            render={<Link href={postsIndex()}>Cancel</Link>}
                        />
                    </div>
                </>
            )}
        </Form>
    );
}
