---
id: JOEY-5.2
title: Markdown editor with server-rendered preview and image upload
status: To Do
assignee: []
created_date: '2026-07-29 23:16'
labels:
  - frontend
  - backend
  - admin
milestone: m-4
dependencies:
  - JOEY-5.1
  - JOEY-6
  - JOEY-7
references:
  - docs/adr/0004-admin-authors-markdown-with-server-rendered-preview.md
parent_task_id: JOEY-5
priority: high
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The post editor UI within admin CRUD (JOEY-5.1): a CodeMirror-based markdown-source editor with a live preview pane rendered by the server-side MarkdownRenderer (JOEY-6), so the preview is byte-identical to the published page (docs/adr/0004) — same Phiki highlighting and Mermaid handling. Debounce the content and POST it to an admin-only preview endpoint that returns content_html. Drag-drop / toolbar image upload runs the R2 + Intervention pipeline (JOEY-7) and inserts the returned ![](url) markdown at the cursor. This is deliberately a markdown editor, NOT a rich-text WYSIWYG (docs/adr/0004).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A CodeMirror markdown-source editor with syntax highlighting is embedded in the post create/edit screen
- [ ] #2 A live preview pane renders via an admin-only server preview endpoint using the same MarkdownRenderer as publishing (Phiki + Mermaid), debounced, and matches the published output
- [ ] #3 Image upload (drag-drop or toolbar) processes via the R2 pipeline and inserts the returned image markdown at the cursor
- [ ] #4 The preview and upload endpoints are gated to auth + verified
- [ ] #5 Tests cover: the preview endpoint returns rendered HTML and is auth-gated; the upload endpoint stores via the pipeline and returns a usable URL
- [ ] #6 composer fmt/lint/refactor and frontend lint checks pass
<!-- AC:END -->
