---
id: JOEY-9
title: Post reactions API
status: To Do
assignee: []
created_date: '2026-07-29 23:14'
labels:
  - backend
milestone: m-2
dependencies:
  - JOEY-3
references:
  - docs/adr/0001-mysql-is-the-source-of-truth-for-posts.md
  - >-
    ../joeymckenzie.tech.old/main/app/Http/Controllers/Api/PostReactionController.php
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the anonymous emoji reactions API to the new schema. Reactions link to the post by post_id foreign key (not slug), so editing a slug in the admin never orphans them. Anonymous visitors toggle one reaction of each type per post, deduped by ip_hash (xxh128). Endpoints: an index returning per-type counts plus the current visitor's reactions for a post, and a store that toggles a reaction (adds if absent, removes if present) with the value validated against the Reaction enum. Rate-limited. Reference: app/Http/Controllers/Api/PostReactionController.php in ../joeymckenzie.tech.old/main. No legacy reaction data is migrated.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The reactions index endpoint returns per-type counts and the requesting ip_hash's current reactions for a post
- [ ] #2 The reactions store endpoint toggles a reaction validated against the Reaction enum, deduped per ip_hash per post, and is rate-limited
- [ ] #3 Reactions link by post_id FK and cascade-delete with the post
- [ ] #4 Tests cover toggle add-then-remove, count aggregation, rejection of an invalid reaction, and throttling
- [ ] #5 composer fmt, lint, and refactor checks pass
<!-- AC:END -->
