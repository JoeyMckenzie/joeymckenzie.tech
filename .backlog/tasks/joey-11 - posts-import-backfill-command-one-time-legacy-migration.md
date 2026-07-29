---
id: JOEY-11
title: 'posts:import backfill command (one-time legacy migration)'
status: To Do
assignee: []
created_date: '2026-07-29 23:15'
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
- [ ] #1 posts:import parses each content/posts/*.md file's front matter and body and upserts a post keyed on slug; re-running does not create duplicates
- [ ] #2 The cover image and all inline images are uploaded to R2 via the image pipeline; the cover is stored as an object key and inline references are rewritten to absolute R2 URLs in the stored markdown content
- [ ] #3 content_html is rendered and reading_time_minutes computed at import time; tag_id is resolved, creating the tag if absent
- [ ] #4 Running against a clean database imports all 32 posts with resolvable images and correct draft/published state
- [ ] #5 A test over a representative fixture proves front matter is parsed, an image is uploaded and its reference rewritten (fake disk), and the row upserts idempotently
- [ ] #6 composer fmt, lint, and refactor checks pass
<!-- AC:END -->
