---
id: JOEY-8
title: Blog read controllers (index and show) with search and view tracking
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
- [ ] #1 The blog index returns published posts with a working ?tag= filter and LIKE search on title+description; drafts/future posts are excluded for guests and included for the authenticated author; heavy content columns are not selected
- [ ] #2 The blog show endpoint returns the post with its stored content_html
- [ ] #3 Visiting show records at most one view per ip_hash per post per 24h and increments views_count accordingly; the authenticated author's visits record nothing
- [ ] #4 Tests cover search, tag filtering, draft visibility by auth state, 24h view dedupe, and author views not being counted
- [ ] #5 composer fmt, lint, and refactor checks pass
<!-- AC:END -->
