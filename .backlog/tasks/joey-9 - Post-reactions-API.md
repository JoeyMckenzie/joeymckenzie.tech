---
id: JOEY-9
title: Post reactions API
status: Done
assignee: []
created_date: '2026-07-29 23:14'
updated_date: '2026-07-30 16:32'
labels:
  - backend
milestone: m-2
dependencies:
  - JOEY-3
references:
  - docs/adr/0001-mysql-is-the-source-of-truth-for-posts.md
  - >-
    ../joeymckenzie.tech.old/main/app/Http/Controllers/Api/PostReactionController.php
modified_files:
  - app/Http/Controllers/PostReactionController.php
  - app/Support/VisitorHash.php
  - app/Http/Controllers/BlogController.php
  - routes/web.php
  - database/seeders/PostSeeder.php
  - tests/Feature/Blog/PostReactionTest.php
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the anonymous emoji reactions API to the new schema. Reactions link to the post by post_id foreign key (not slug), so editing a slug in the admin never orphans them. Anonymous visitors toggle one reaction of each type per post, deduped by ip_hash (xxh128). Endpoints: an index returning per-type counts plus the current visitor's reactions for a post, and a store that toggles a reaction (adds if absent, removes if present) with the value validated against the Reaction enum. Rate-limited. Reference: app/Http/Controllers/Api/PostReactionController.php in ../joeymckenzie.tech.old/main. No legacy reaction data is migrated.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The reactions index endpoint returns per-type counts and the requesting ip_hash's current reactions for a post
- [x] #2 The reactions store endpoint toggles a reaction validated against the Reaction enum, deduped per ip_hash per post, and is rate-limited
- [x] #3 Reactions link by post_id FK and cascade-delete with the post
- [x] #4 Tests cover toggle add-then-remove, count aggregation, rejection of an invalid reaction, and throttling
- [x] #5 composer fmt, lint, and refactor checks pass
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Anonymous emoji reactions API, ported to the new schema.

`PostReactionController` (route-model-bound `Post`, so drafts 404 for guests via the global scope):
- **index** — returns `{counts, userReactions}`: per-type counts across all four `Reaction` cases plus the requesting visitor's current reactions.
- **store** — validates the value against the `Reaction` enum (422 otherwise), toggles it (add if absent, remove if present) deduped per ip_hash per post, and returns the fresh snapshot. Route rate-limited `throttle:30,1`.

Reactions link by `post_id` FK and cascade-delete with the post (verified). Visitor identity is the salted `xxh128` hash, now shared with view tracking via a new `App\Support\VisitorHash` (BlogController refactored onto it — one source of truth).

Tests (`PostReactionTest`, 6): index counts + visitor reactions, toggle add-then-remove, invalid-reaction rejection (422), throttling (429 past 30/min), cascade delete, and guest-can't-react-to-draft (404). Full suite 63/63 (289 assertions). pint, phpstan, rector all pass.
<!-- SECTION:FINAL_SUMMARY:END -->
