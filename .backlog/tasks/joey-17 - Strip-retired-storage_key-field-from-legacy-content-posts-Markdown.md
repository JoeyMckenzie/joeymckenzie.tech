---
id: JOEY-17
title: Strip retired storage_key field from legacy content/posts Markdown
status: To Do
assignee: []
created_date: '2026-08-02 21:37'
labels:
  - blog
  - cleanup
dependencies: []
priority: low
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Remove the `storage_key:` frontmatter line from all legacy Markdown files in `content/posts/`. `storage_key` is a leftover from an older implementation that is no longer used — the one-time `posts:import` backfill (JOEY-11) does not read it, and the new Markdown export (sibling task) will not emit it. Retiring it keeps the archived files clean and consistent with the export format going forward.

Scope: 32 files currently contain `storage_key`. Only remove that single line from each file's YAML frontmatter — leave `tag_id` and every other field untouched (this cleanup is deliberately scoped to `storage_key` only). Body content must not change.

There is no code that references `storage_key` (verify with a repo search before and after), so this is a content-only change with no application code impact.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 No file under content/posts/ contains a storage_key frontmatter line (rg storage_key content/posts returns nothing)
- [ ] #2 Only the storage_key line is removed from each file; tag_id, other frontmatter fields, and all body content are unchanged (diff shows only storage_key line deletions)
- [ ] #3 A repo-wide search confirms no application code references storage_key
<!-- AC:END -->
