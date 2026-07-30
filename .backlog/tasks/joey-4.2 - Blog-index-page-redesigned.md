---
id: JOEY-4.2
title: Blog index page (redesigned)
status: Done
assignee: []
created_date: '2026-07-29 23:15'
updated_date: '2026-07-30 06:39'
labels:
  - frontend
milestone: m-3
dependencies:
  - JOEY-8
  - JOEY-4.1
modified_files:
  - app/Http/Controllers/BlogController.php
  - routes/web.php
  - database/seeders/PostSeeder.php
  - database/seeders/DatabaseSeeder.php
  - resources/js/pages/blog/index.tsx
  - tests/Feature/Blog/BlogIndexTest.php
parent_task_id: JOEY-4
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the redesigned public blog index/listing page in React (Inertia), consuming the index endpoint from JOEY-8 and using the design direction and primitives from JOEY-4.1. Includes the post list/cards (cover, title, description, tag, formatted published date, reading time, view count), the tag filter, and a search input wired to the ?tag= / ?search query params (reflected in the URL). Responsive and dark-mode aware. This replaces the old blog/index page with a fresh design, not a port.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The index page renders published posts from the read endpoint showing cover, title, description, tag, formatted date, reading time, and view count
- [x] #2 Tag filtering and title/description search work via query params and are reflected in the URL
- [x] #3 Uses the design direction and primitives from the design-direction subtask; responsive and dark-mode aware
- [x] #4 Frontend lint and format checks pass and the page renders against imported/seeded data
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Built the redesigned blog index on the Nocturne system (JOEY-4.1).

Scope decision (with Joey): pulled the JOEY-8 *index slice* forward to unblock the frontend — BlogController@index + `GET /blog` route + PostSeeder (17 realistic posts drawn from real titles, incl. 1 draft + 1 future post). JOEY-8 still owns the show endpoint, view tracking (24h dedupe), and their tests.

Controller: selects only lightweight columns (never content/content_html), eager-loads tag, `?tag=` filters by tag name, `?search=` LIKEs title+description, orders by published_at desc, maps to the BlogPost shape. Guest/author visibility comes free from the Post `visibleToGuest` global scope. Seeded image keys aren't URLs, so cover falls back to the coverless plate (real R2 covers per ADR 0002 later).

Frontend (resources/js/pages/blog/index.tsx): search input + tag chips → `router.get(index.url(), …, {preserveState, preserveScroll, replace})`; filters reflect in the URL, input keeps focus while typing. PostCard list, "No matches" empty state with clear-filters, and the statusline footer showing the count. Null layout via the app.tsx `blog/` case.

Verified in-browser (Playwright): 15 guest posts render; `?tag=rust`→2; `?tag=rust&search=shuttle`→1; focus retained across debounced nav; empty state + clear reset to /blog (15); responsive at 390px and light-mode correct.

Note: the Vite dev-server HMR overlay/console errors seen during review are the same Vite `hmr()` internal bug from before, not app errors — production build is clean.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Shipped the redesigned public blog index at `GET /blog`, built on the Nocturne design system.

**Frontend** — `resources/js/pages/blog/index.tsx`: Fraunces hero + first-light sweep, a search input and tag chips wired to `?search=`/`?tag=` (reflected in the URL, debounced, focus-preserving), the PostCard list, a "No matches" empty state with clear-filters, and the statusline footer. Standalone public layout. Responsive and dark/light aware.

**Backend (JOEY-8 index slice, pulled forward)** — `BlogController@index` (lightweight columns only, tag-name filter, title+description LIKE search, guest/author visibility via the model global scope) + route; `PostSeeder` with 17 realistic posts (incl. a draft and a future post) so the page renders against seeded data.

**Tests** — `tests/Feature/Blog/BlogIndexTest.php`: guest listing, draft/future hidden from guests and shown to the author, tag filter, title+description search. 5/5 pass; full suite 51/51 (208 assertions).

**Checks** — pint, phpstan, rector, prettier, eslint, tsc, and the production build all pass. Verified in-browser (dark/light, mobile, all filter interactions).

Deferred to JOEY-8: the show endpoint and view tracking (24h dedupe, author-view exclusion) plus their tests. Parent JOEY-4 left open.
<!-- SECTION:FINAL_SUMMARY:END -->
