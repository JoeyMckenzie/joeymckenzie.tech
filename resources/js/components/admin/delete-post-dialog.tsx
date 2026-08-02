import { Form } from '@inertiajs/react';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export function DeletePostDialog({
    post,
}: {
    post: { id: number; title: string };
}) {
    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete ${post.title}`}
                        className="font-mono text-xs text-subtle hover:bg-destructive/10 hover:text-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                        data-test="delete-post-button"
                    >
                        Delete
                    </Button>
                }
            />

            <DialogContent className="nocturne-admin-dialog border-hairline bg-panel font-body text-prose shadow-2xl shadow-black/20">
                <DialogHeader className="min-w-0">
                    <DialogTitle className="font-display text-2xl leading-tight font-medium tracking-tight [overflow-wrap:anywhere] break-words text-prose">
                        Delete “{post.title}”?
                    </DialogTitle>

                    <DialogDescription className="leading-6 [overflow-wrap:anywhere] break-words text-subtle">
                        This permanently deletes “{post.title}”. Its view counts
                        and reactions go with it, and the public URL stops
                        resolving. This cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...PostController.destroy.form({ post: post.id })}
                    options={{
                        preserveScroll: true,
                    }}
                    className="flex flex-col gap-6"
                >
                    {({ processing }) => (
                        <DialogFooter className="gap-2">
                            <DialogClose
                                render={
                                    <Button
                                        variant="outline"
                                        className="border-hairline bg-panel font-mono text-xs text-prose shadow-none hover:bg-canvas hover:text-iris focus-visible:border-iris focus-visible:ring-iris/20"
                                    >
                                        Cancel
                                    </Button>
                                }
                            />

                            <Button
                                variant="destructive"
                                disabled={processing}
                                render={
                                    <button
                                        type="submit"
                                        data-test="confirm-delete-post-button"
                                    >
                                        {processing
                                            ? 'Deleting…'
                                            : 'Delete post'}
                                    </button>
                                }
                            />
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
