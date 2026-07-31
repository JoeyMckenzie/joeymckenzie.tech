import { Form } from '@inertiajs/react';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
                        variant="destructive"
                        size="sm"
                        data-test="delete-post-button"
                    >
                        Delete
                    </Button>
                }
            />

            <DialogContent>
                <DialogTitle>Delete “{post.title}”?</DialogTitle>

                <DialogDescription>
                    This permanently deletes “{post.title}”. Its view counts and
                    reactions go with it, and the public URL stops resolving.
                    This cannot be undone.
                </DialogDescription>

                <Form
                    {...PostController.destroy.form({ post: post.id })}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing }) => (
                        <DialogFooter className="gap-2">
                            <DialogClose
                                render={
                                    <Button variant="secondary">Cancel</Button>
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
                                        Delete post
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
