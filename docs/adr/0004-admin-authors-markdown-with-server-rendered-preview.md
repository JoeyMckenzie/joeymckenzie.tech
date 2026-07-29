# The admin authors markdown with a server-rendered live preview

The post editor is a markdown-source editor (CodeMirror) with a live preview pane, **not** a rich-text WYSIWYG (Tiptap/ProseMirror/Lexical) that serializes back to markdown. Rich-text serialization is lossy and breaks down precisely on code blocks and Mermaid diagrams, which dominate this technical blog; markdown-source keeps what you type as exactly what is stored.

To make it feel WYSIWYG without the lossiness, the preview is rendered by the **same server-side `MarkdownRenderer`** used for publishing (debounced POST to an admin-only preview endpoint returning real `content_html`), so preview is byte-identical to the published page — same Phiki highlighting, same Mermaid. Image upload in the editor runs the R2 + Intervention pipeline (see ADR 0002) and inserts the returned `![](url)`. Deliberately recorded so the editor is not later "upgraded" to a rich-text WYSIWYG, which would be a regression for this content.
