---
id: JOEY-11
title: 'posts:import backfill command (one-time legacy migration)'
status: Done
assignee: []
created_date: '2026-07-29 23:15'
updated_date: '2026-07-30 17:52'
labels:
  - backend
milestone: m-1
dependencies:
  - JOEY-3
  - JOEY-6
  - JOEY-7
references:
  - docs/adr/0001-mysql-is-the-source-of-truth-for-posts.md
  - docs/adr/0002-images-on-r2-normalized-to-webp.md
  - ../joeymckenzie.tech.old/main/content/posts
modified_files:
  - app/Services/PostImporter.php
  - app/Console/Commands/ImportPostsCommand.php
  - tests/Feature/Blog/PostImporterTest.php
priority: high
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The one-time command that migrates the 32 legacy markdown posts in content/posts/*.md into MySQL (docs/adr/0001). It is idempotent (safe to re-run in dev) but is NOT wired into deploy — it is run by hand exactly once against production after the first deploy, then never again (so it can't clobber later admin edits).

For each file: parse front matter with spatie/yaml-front-matter, resolve tag_id from the front-matter tag (create the tag if missing), upload every referenced image — the cover from the `image` field and every inline ![](assets/images/...) reference — through the image pipeline (JOEY-7) to R2, rewrite the cover to the stored R2 object key and inline references to their absolute R2 URLs in the stored markdown, render content_html (JOEY-6), compute reading_time_minutes, and updateOrCreate the post keyed on slug (JOEY-3). Ignore the front-matter storage_key. No reaction or view data is migrated (there is none in the repo).

IMPORTANT: the 63 legacy image files are NOT in this repo — they live in the old repo at ../joeymckenzie.tech.old/main/public/assets/images. The command reads them from there (or a copied-in staging location) for the one-time import.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 posts:import parses each content/posts/*.md file's front matter and body and upserts a post keyed on slug; re-running does not create duplicates
- [x] #2 The cover image and all inline images are uploaded to R2 via the image pipeline; the cover is stored as an object key and inline references are rewritten to absolute R2 URLs in the stored markdown content
- [x] #3 content_html is rendered and reading_time_minutes computed at import time; tag_id is resolved, creating the tag if absent
- [x] #4 Running against a clean database imports all 32 posts with resolvable images and correct draft/published state
- [x] #5 A test over a representative fixture proves front matter is parsed, an image is uploaded and its reference rewritten (fake disk), and the row upserts idempotently
- [x] #6 composer fmt, lint, and refactor checks pass
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
One-time backfill importing the 32 legacy markdown posts into MySQL.

`App\Services\PostImporter::import(string $rawContents, string $imagesRoot): Post` — parses front matter (spatie/yaml-front-matter), resolves the tag by numeric `tag_id` (`firstOrCreate` with the canonical id→name map, so an absent tag is created named), uploads the cover via ImageProcessor (stored as an R2 object key in `posts.image`), rewrites every local inline image to its absolute R2 URL in the stored markdown while leaving external URLs untouched, renders `content_html` (MarkdownRenderer), computes `reading_time_minutes`, and `updateOrCreate`s keyed on slug (idempotent). `posts:import {--images=}` command runs it over `content/posts/*.md`; not wired into deploy.

Legacy-data wrinkles handled: inline images use assorted roots (`/assets/blog/`, `/images/`, a typo `/asset/blog/`) — stripped and resolved under the images tree with a basename fallback (hardened with CATCH_GET_CHILD); unquoted YAML dates (`2019-10-04`) arrive as Unix timestamps and are converted; video (`.webm`/`.mp4`) refs and one genuinely-missing PNG are left unchanged (out of the image pipeline's scope), not fatal.

Validated against a clean dev DB over all 32 real files (fake R2 disk, real legacy images): **32 posts imported, 9 tags created, 0 unresolved covers, all 32 correctly published**. Fixture test (self-contained, CI-safe, fake disk) proves front-matter parse, image upload + reference rewrite, external-URL passthrough, timestamp-date handling, and idempotent upsert. Full suite 76/76 (328 assertions); pint/phpstan/rector pass.

Note: the real production run needs the legacy images staged at the `--images` path; local runs use a faked disk (no R2 creds in dev), so cover keys resolve to the coverless plate and inline URLs won't load locally.
<!-- SECTION:FINAL_SUMMARY:END -->
