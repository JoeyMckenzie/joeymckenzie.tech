---
id: JOEY-3
title: 'Blog schema, models, factories, tag seeder, and reaction enum'
status: To Do
assignee: []
created_date: '2026-07-29 23:12'
labels:
  - backend
  - database
milestone: m-1
dependencies: []
references:
  - docs/adr/0001-mysql-is-the-source-of-truth-for-posts.md
  - CONTEXT.md
priority: high
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the MySQL data layer that replaces Orbit. Posts are authored in markdown with the database as the source of truth (docs/adr/0001); slug is the unique natural key and route key (Orbit's storage_key is dropped); a post has exactly one tag; views and reactions are foreign-key linked to the post row (not the slug). This task is schema + Eloquent models + factories only — markdown rendering, the image pipeline, and the import command are separate tasks that build on it.

Agreed schema:
- tags: id, name (unique, lowercase, URL-safe — used for both #display and the ?tag= filter), timestamps
- posts: id, tag_id (FK), title, slug (unique), description, content (longtext, markdown source), content_html (longtext, nullable, rendered), image (R2 object key for the cover), reading_time_minutes (int, computed at write), published_at (nullable), views_count (unsigned bigint default 0), timestamps
- post_views: id, post_id (FK, cascade on delete), ip_hash (xxh128), referrer (nullable), user_agent (nullable), viewed_at (indexed)
- post_reactions: id, post_id (FK, cascade on delete), reaction (enum), ip_hash (xxh128), timestamps

Publish semantics: a post is published when published_at is set AND <= now(); null published_at is a draft; a future published_at schedules go-live. Drafts (and not-yet-live scheduled posts) are visible only to the authenticated author, hidden from guests — gate on auth()->guest(), NOT on the environment (this replaces the old App::isProduction() hack).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Migrations create the tags, posts, post_views, and post_reactions tables exactly as specified, with the stated foreign keys, cascade-on-delete, unique constraints, and the viewed_at index
- [ ] #2 Reaction is a string-backed PHP enum with Fire, ThumbsUp, MindBlown, Heart (PascalCase cases per conventions); post_reactions.reaction casts to it
- [ ] #3 Post model has tag() BelongsTo and views()/reactions() HasMany; a published() scope (published_at not null and <= now) and a global scope hiding drafts and future-dated posts from guests while showing them to the authenticated author; the formatted_published_at accessor is retained
- [ ] #4 Factories exist for all four models; a TagSeeder seeds the nine known tags: laravel, php, dotnet, angular, astro, design, react, rust, zig
- [ ] #5 php artisan ide-helper:models -RW is run for the new models
- [ ] #6 Tests prove: the published/global scope hides drafts and future-dated posts from guests and reveals them to the authenticated author; factories build valid rows
- [ ] #7 composer fmt, lint, and refactor checks pass
<!-- AC:END -->
