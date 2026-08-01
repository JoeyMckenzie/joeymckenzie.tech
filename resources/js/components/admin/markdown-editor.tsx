import { markdown } from '@codemirror/lang-markdown';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { ImagePlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ClipboardEvent, DragEvent, UIEvent } from 'react';
import { RenderedMarkdown } from '@/components/blog/rendered-markdown';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAppearance } from '@/hooks/use-appearance';
import { useMarkdownPreview } from '@/hooks/use-markdown-preview';
import { usePostImageUpload } from '@/hooks/use-post-image-upload';
import { useSynchronizedScroll } from '@/hooks/use-synchronized-scroll';
import { cn } from '@/lib/utils';

type Pane = 'write' | 'preview';

/**
 * Prose chrome, not IDE chrome: no line numbers, no fold gutter, no active-line
 * highlight. Everything else in `basicSetup` is opt-out, so it stays on.
 */
const SETUP = {
    lineNumbers: false,
    foldGutter: false,
    highlightActiveLine: false,
    highlightActiveLineGutter: false,
};

const EXTENSIONS = [
    markdown(),
    EditorView.lineWrapping,
    EditorView.contentAttributes.of({
        'aria-label': 'Content (markdown)',
    }),
];

/**
 * True when a drag or clipboard payload carries an image. Checked against
 * `items` rather than `files` because `files` is empty during `dragover`.
 */
function carriesImage(items: DataTransferItemList): boolean {
    return Array.from(items).some(
        (item) => item.kind === 'file' && item.type.startsWith('image/'),
    );
}

/**
 * Markdown source editor with a live, server-rendered preview (JOEY-5.2).
 *
 * Per ADR 0004 this is deliberately a CodeMirror *source* editor rather than a
 * rich-text surface: WYSIWYG serialisation is lossy exactly on the fenced code
 * and Mermaid diagrams this blog is made of. The preview HTML comes back from
 * `admin.posts.preview`, which runs the same `MarkdownRenderer` as publishing,
 * so what is on the right is what readers get.
 *
 * CodeMirror is not a form control, so a hidden `<textarea name={name}>` mirrors
 * the document. `<Form>` serialises the DOM with `new FormData(form)`, which
 * includes hidden-but-enabled fields, so `content` reaches `PostRequest`
 * unchanged.
 */
export function MarkdownEditor({
    name,
    defaultValue,
    slug,
}: {
    name: string;
    defaultValue?: string;
    slug: string;
}) {
    const [doc, setDoc] = useState(defaultValue ?? '');
    const [pane, setPane] = useState<Pane>('write');
    const view = useRef<EditorView | null>(null);
    const picker = useRef<HTMLInputElement>(null);
    const previewScroller = useRef<HTMLDivElement>(null);
    const { resolvedAppearance } = useAppearance();
    const { html } = useMarkdownPreview(doc);
    const { upload, uploading, progress } = usePostImageUpload(slug);
    const synchronizeScroll = useSynchronizedScroll();

    useEffect(() => {
        const sourceScroller = view.current?.scrollDOM;

        if (sourceScroller !== undefined) {
            synchronizeScroll(sourceScroller, previewScroller.current);
        }
    }, [html, synchronizeScroll]);

    const insert = async (file: File): Promise<void> => {
        const url = await upload(file);
        const editor = view.current;

        // A failed upload inserts nothing — the hook has already toasted — and
        // there is nowhere to insert before CodeMirror has mounted.
        if (url === null || editor === null) {
            return;
        }

        editor.dispatch(editor.state.replaceSelection(`![](${url})`));
        editor.focus();
    };

    const insertFirstImage = (files: FileList | null): void => {
        const file = Array.from(files ?? []).find((candidate) =>
            candidate.type.startsWith('image/'),
        );

        if (file === undefined) {
            return;
        }

        void insert(file);
    };

    // Capture phase on purpose: CodeMirror's own drop handler reads dropped
    // files with FileReader and pastes their bytes as text, and it bails out of
    // every handler once `defaultPrevented` is set. Claiming the event upstream
    // is what stops a dropped PNG turning into binary noise in the document.
    const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
        if (!carriesImage(event.dataTransfer.items)) {
            return;
        }

        event.preventDefault();
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
        if (!carriesImage(event.dataTransfer.items)) {
            return;
        }

        event.preventDefault();
        insertFirstImage(event.dataTransfer.files);
    };

    const handlePaste = (event: ClipboardEvent<HTMLDivElement>): void => {
        if (!carriesImage(event.clipboardData.items)) {
            return;
        }

        event.preventDefault();
        insertFirstImage(event.clipboardData.files);
    };

    const handleSourceScroll = (event: UIEvent<HTMLDivElement>): void => {
        const sourceScroller = event.target;

        if (
            !(sourceScroller instanceof HTMLElement) ||
            !sourceScroller.classList.contains('cm-scroller')
        ) {
            return;
        }

        synchronizeScroll(sourceScroller, previewScroller.current);
    };

    const handlePreviewScroll = (event: UIEvent<HTMLDivElement>): void => {
        synchronizeScroll(event.currentTarget, view.current?.scrollDOM ?? null);
    };

    const uploadLabel =
        progress === null ? 'Uploading…' : `Uploading… ${progress}%`;

    return (
        <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-hairline bg-panel px-2 py-1.5 font-mono text-xs text-subtle">
                <div className="flex min-w-0 items-center gap-1">
                    <span className="hidden px-2 text-[0.6875rem] tracking-[0.12em] text-iris sm:inline">
                        MARKDOWN
                    </span>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={uploading}
                        onClick={() => picker.current?.click()}
                        className="font-mono text-xs text-subtle hover:bg-canvas hover:text-prose"
                    >
                        {uploading ? <Spinner /> : <ImagePlus aria-hidden />}

                        {uploading ? uploadLabel : 'Insert image'}
                    </Button>
                </div>

                <input
                    ref={picker}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                        insertFirstImage(event.target.files);
                        // Let the operator pick the same file again later.
                        event.target.value = '';
                    }}
                />

                <div className="flex items-center gap-1 lg:hidden">
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        aria-pressed={pane === 'write'}
                        data-test="markdown-write-toggle"
                        onClick={() => setPane('write')}
                        className={cn(
                            'font-mono text-xs',
                            pane === 'write'
                                ? 'bg-iris/10 text-iris hover:bg-iris/15 hover:text-iris'
                                : 'text-subtle hover:bg-canvas hover:text-prose',
                        )}
                    >
                        Write
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        aria-pressed={pane === 'preview'}
                        data-test="markdown-preview-toggle"
                        onClick={() => setPane('preview')}
                        className={cn(
                            'font-mono text-xs',
                            pane === 'preview'
                                ? 'bg-iris/10 text-iris hover:bg-iris/15 hover:text-iris'
                                : 'text-subtle hover:bg-canvas hover:text-prose',
                        )}
                    >
                        Preview
                    </Button>
                </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
                <div
                    onDragOverCapture={handleDragOver}
                    onDropCapture={handleDrop}
                    onPasteCapture={handlePaste}
                    onScrollCapture={handleSourceScroll}
                    className={cn(
                        'nocturne-editor min-w-0 overflow-hidden rounded-md border border-hairline bg-panel focus-within:border-iris',
                        pane === 'preview' && 'hidden lg:block',
                    )}
                >
                    <CodeMirror
                        value={doc}
                        onChange={setDoc}
                        theme={resolvedAppearance}
                        extensions={EXTENSIONS}
                        basicSetup={SETUP}
                        minHeight="28rem"
                        maxHeight="34rem"
                        placeholder="## Heading"
                        className="font-mono text-sm"
                        onCreateEditor={(editor) => {
                            view.current = editor;
                        }}
                    />
                </div>

                <div
                    className={cn(
                        'flex min-w-0 flex-col overflow-hidden rounded-md border border-hairline bg-canvas',
                        pane === 'write' && 'hidden lg:flex',
                    )}
                    data-test="markdown-preview-pane"
                >
                    <div
                        ref={previewScroller}
                        onScroll={handlePreviewScroll}
                        className="max-h-[34rem] min-h-[28rem] overflow-y-auto p-5 sm:p-6"
                    >
                        {doc.trim() === '' ? (
                            <p className="font-mono text-xs leading-5 text-subtle">
                                Nothing to preview yet. Whatever you write is
                                rendered by the same markdown pipeline that
                                publishes the post.
                            </p>
                        ) : (
                            <RenderedMarkdown html={html} />
                        )}
                    </div>
                </div>
            </div>

            {/* CodeMirror is not a form control; this is what `<Form>` sends. */}
            <textarea name={name} value={doc} readOnly hidden />
        </div>
    );
}
