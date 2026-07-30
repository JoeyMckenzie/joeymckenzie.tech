---
id: JOEY-6
title: 'MarkdownRenderer service and posts:rerender command'
status: Done
assignee: []
created_date: '2026-07-29 23:14'
updated_date: '2026-07-30 17:22'
labels:
  - backend
milestone: m-1
dependencies:
  - JOEY-1
references:
  - docs/adr/0004-admin-authors-markdown-with-server-rendered-preview.md
  - ../joeymckenzie.tech.old/main/app/Services/MarkdownRenderer.php
modified_files:
  - app/Services/MarkdownRenderer.php
  - app/Services/CommonMark/MermaidExtension.php
  - app/Services/CommonMark/MermaidRenderer.php
  - app/Console/Commands/RerenderPostsCommand.php
  - tests/Feature/Blog/MarkdownRendererTest.php
  - tests/Feature/Blog/RerenderPostsCommandTest.php
priority: high
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the markdown-to-HTML rendering used to display posts, and provide a command to re-render all stored posts. Rendering happens at write time (during import and admin save) and the HTML is stored in posts.content_html; read requests serve the stored HTML (docs/adr/0004 explains the write-time approach and the rerender escape hatch for theme changes).

Port the previous CommonMark pipeline: CommonMark core + Phiki (TokyoNight theme) syntax highlighting + a Mermaid extension that wraps ```mermaid fenced blocks into <div class=\"mermaid\">…</div> for client-side rendering + Strikethrough. Reference implementations to port from the old repo: app/Services/MarkdownRenderer.php, app/Services/CommonMark/MermaidExtension.php, app/Services/CommonMark/MermaidRenderer.php at ../joeymckenzie.tech.old/main.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A MarkdownRenderer service converts markdown to HTML using CommonMark core, Phiki (TokyoNight), the Mermaid fenced-code extension, and Strikethrough; identical markdown yields identical HTML
- [x] #2 ```mermaid fenced blocks render to <div class="mermaid">…</div> (drawn client-side), not to highlighted code
- [x] #3 A posts:rerender artisan command re-renders content into content_html for all posts and is idempotent
- [x] #4 Tests prove: a code block is Phiki-highlighted, a mermaid block becomes a mermaid div, and posts:rerender refreshes content_html for existing posts
- [x] #5 composer fmt, lint, and refactor checks pass
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Ported the markdown → HTML pipeline and the re-render command.

- **`App\Services\MarkdownRenderer`** — `render(string $markdown): string` over CommonMark core + Phiki (TokyoNight) + the Mermaid fenced-code extension + Strikethrough. Deterministic (identical markdown → identical HTML). Write-time rendering; reads serve the stored `content_html`.
- **Mermaid extension/renderer** — ```mermaid fences become `<div class="mermaid">…</div>` (priority over Phiki's fenced-code renderer; other fences fall through to highlighting). Confirmed Phiki emits `data-language="…"`, which the Nocturne prose CSS uses for the code-block language tag — so real imported content gets the language label for free.
- **`posts:rerender`** command (`#[Signature]`/`#[Description]` style) — re-renders every post's `content` into `content_html`, including drafts/future (bypasses the visibility scope). Idempotent. Ran live: "Re-rendered 17 posts".

Tests (6): code highlighted by Phiki, mermaid → div (and not highlighted), strikethrough, deterministic output, and the command refreshes content_html for published + draft posts idempotently. Full suite 69/69 (303 assertions); pint/phpstan/rector pass.

Unblocks JOEY-11 (import) once JOEY-7 (image pipeline) lands.
<!-- SECTION:FINAL_SUMMARY:END -->
