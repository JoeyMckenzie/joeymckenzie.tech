---
id: JOEY-5.8
title: Export post to Markdown from admin index
status: To Do
assignee: []
created_date: '2026-08-02 21:36'
labels:
  - blog
  - admin
dependencies: []
parent_task_id: JOEY-5
priority: medium
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add an "Export" action beside Edit/Delete on the admin post index that downloads a post as a Markdown file (YAML frontmatter + body). Purpose: the operator writes posts on prod, then exports the generated Markdown to version it in the repo's `content/posts/` folder as a git archive.

## Design decisions (agreed via grilling session — honor these)

**Target is a human-readable git archive, NOT a re-importable format.** Nothing consumes `content/posts/` at runtime (only the one-time `posts:import` command reads it; the live site renders from MySQL). So optimize for a clean file a human reads later in git — do not carry importer-only metadata.

**This is the inverse of `App\Services\PostImporter`.** Implement a symmetric `App\Services\PostExporter` (`final readonly`) with `export(Post $post): string` returning frontmatter + `$post->content` (body emitted verbatim — inline images are already absolute URLs in the stored content). Serialize frontmatter with `Symfony\Component\Yaml\Yaml::dump` (symfony/yaml v8 is installed).

**Frontmatter shape** — exactly these keys:
`title`, `slug`, `description`, `image`, `tag`, `published_at`
- `tag` is the tag NAME (e.g. `astro`), not `tag_id`.
- `image` is the fully-qualified public URL via the existing `HasCoverUrl::coverUrl()` helper; OMIT the key entirely when the cover is blank.
- `published_at` omitted for drafts (null publish date).
- Do NOT emit `storage_key` (legacy field being retired in the sibling cleanup task).

**Controller:** dedicated single-action invokable `App\Http\Controllers\Admin\PostExportController`, matching the existing `PostImageController` / `PostPreviewController` convention. It wires request → `PostExporter` → `response()->streamDownload(...)` with `Content-Type: text/markdown`.

**Route:** `GET admin/posts/{post:id}/export`, name `admin.posts.export`, inside the existing auth+verified group. Regenerate the Wayfinder helper.

**Filename:** `{published_at:Y-m-d}-{slug}.md`; fall back to `{created_at:Y-m-d}-{slug}.md` when unpublished. Must be deterministic (no `today()`).

**Frontend:** in `resources/js/pages/admin/posts/index.tsx`, add an Export button in `PostActions` (visible on both the desktop table row and `MobilePostCard`, enabled for drafts). Render it as a NATIVE `<a href={export.url({ post: post.id })}>` through the existing `<Button render={...}>` pattern with a `download` attribute — NOT an Inertia `<Link>` (an Inertia visit cannot trigger a browser download). Style to match the outline Edit button.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Admin post index shows an Export action beside Edit/Delete on both the desktop table and the mobile card, for published and draft posts
- [ ] #2 Clicking Export downloads a .md file named {published_at:Y-m-d}-{slug}.md for published posts and {created_at:Y-m-d}-{slug}.md for drafts
- [ ] #3 Exported frontmatter contains title, slug, description, and tag (as the tag NAME), followed by the post's Markdown body verbatim
- [ ] #4 image frontmatter is the fully-qualified cover URL, and the image key is omitted entirely when the post has no cover
- [ ] #5 published_at is present for published posts and omitted for drafts; storage_key is never emitted
- [ ] #6 The export route requires auth+verified; an unauthenticated request cannot download a post
- [ ] #7 Feature test asserts the download response (assertDownload with expected filename) and frontmatter/body contents for both a published post and a draft; unit test covers PostExporter output directly
- [ ] #8 composer fmt, composer lint, pnpm run types:check and lint:check all pass
<!-- AC:END -->
