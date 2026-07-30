---
id: JOEY-8
title: Blog read controllers (index and show) with search and view tracking
status: Done
assignee: []
created_date: '2026-07-29 23:14'
updated_date: '2026-07-30 06:54'
labels:
  - backend
milestone: m-2
dependencies:
  - JOEY-3
references:
  - docs/adr/0001-mysql-is-the-source-of-truth-for-posts.md
modified_files:
  - app/Http/Controllers/BlogController.php
  - routes/web.php
  - database/seeders/PostSeeder.php
  - database/seeders/DatabaseSeeder.php
  - tests/Feature/Blog/BlogIndexTest.php
  - tests/Feature/Blog/BlogShowTest.php
priority: high
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Public read endpoints replacing the old BlogController against the new schema, serving the redesigned Inertia frontend. Index lists published posts with a tag filter (?tag=) and a LIKE substring search over title + description only (not the body); it selects only lightweight columns (slug, title, description, image, tag_id, published_at, reading_time_minutes, views_count) and never loads content/content_html. Show serves a single post's stored content_html and records a view.

View recording (docs/adr/0001 analytics model): insert one post_views row per ip_hash per post per rolling 24h window and increment posts.views_count only when a new event is inserted; never record when the authenticated author is viewing (gate on auth()->guest()). Draft and future-dated posts are visible only to the authenticated author via the model scope from JOEY-3.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The blog index returns published posts with a working ?tag= filter and LIKE search on title+description; drafts/future posts are excluded for guests and included for the authenticated author; heavy content columns are not selected
- [x] #2 The blog show endpoint returns the post with its stored content_html
- [x] #3 Visiting show records at most one view per ip_hash per post per 24h and increments views_count accordingly; the authenticated author's visits record nothing
- [x] #4 Tests cover search, tag filtering, draft visibility by auth state, 24h view dedupe, and author views not being counted
- [x] #5 composer fmt, lint, and refactor checks pass
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Heads-up: the **index** half of this task was pulled forward during JOEY-4.2 to unblock the frontend. Already implemented: `app/Http/Controllers/BlogController@index` + `GET /blog` route (name `blog.index`), `database/seeders/PostSeeder.php`, and `tests/Feature/Blog/BlogIndexTest.php` covering index search, tag filtering, and draft/future visibility by auth state (AC#1 + the index portion of AC#4). Still to do here: the **show** endpoint (AC#2), **view recording** with 24h ip_hash dedupe + author-view exclusion (AC#3), and its tests (rest of AC#4). Extend the existing BlogController rather than recreating index.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Public blog read endpoints complete. Index (pulled forward in JOEY-4.2) + show, both on `BlogController`, routes `blog.index` / `blog.show`.

**Show** (`BlogController@show`): route-model-bound by slug; the Post `visibleToGuest` global scope gives guests a 404 on drafts/future posts while the author gets 200. Returns the post with its stored `content_html` for the Inertia post page.

**View tracking** (`recordView`): only when `auth()->guest()`; hashes the IP with `xxh128` salted by the app key; inserts one `post_views` row per ip_hash per post per rolling 24h window and increments `views_count` only on a new insert. The authenticated author records nothing.

**Tests** — `BlogIndexTest` (5): guest listing, draft/future hidden vs shown to author, tag filter, title+description search. `BlogShowTest` (6): content_html returned, guest visit increments + records, 24h dedupe, counts again after the window, author records nothing, guest 404 / author 200 on drafts+future. Full suite 57/57 (237 assertions). pint, phpstan, rector all pass.

Verified live against the seeded dev DB: a real post went 1243 → 1244 across two same-IP visits (counted once), and a draft slug 404s for guests.
<!-- SECTION:FINAL_SUMMARY:END -->
