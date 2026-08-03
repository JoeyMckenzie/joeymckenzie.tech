---
id: JOEY-10
title: RSS feed and sitemap
status: Done
assignee:
  - Joey McKenzie
created_date: '2026-07-29 23:14'
updated_date: '2026-08-03 05:41'
labels:
  - backend
milestone: m-2
dependencies:
  - JOEY-1
  - JOEY-3
references:
  - ../joeymckenzie.tech.old/main/app/Http/Controllers/FeedController.php
modified_files:
  - app/Http/Controllers/FeedController.php
  - app/Http/Controllers/SitemapController.php
  - routes/web.php
  - tests/Feature/Blog/FeedTest.php
  - tests/Feature/Blog/SitemapTest.php
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the RSS feed and sitemap to the new schema. The feed hand-builds RSS XML (no package) from published posts — port from app/Http/Controllers/FeedController.php in ../joeymckenzie.tech.old/main. The sitemap uses spatie/laravel-sitemap and lists the static pages plus each published post URL. Both iterate published posts via the model scope from JOEY-3 and must exclude drafts and future-dated posts.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 GET /feed.xml returns valid RSS listing published posts (title, link, description, pubDate, cover image), newest first
- [x] #2 GET /sitemap.xml lists the site's static routes and every published post URL
- [x] #3 Both exclude drafts and future-dated posts
- [x] #4 Tests assert both endpoints include the expected published posts and exclude unpublished ones
- [x] #5 composer fmt, lint, and refactor checks pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create dedicated FeedController and SitemapController endpoints and register named GET routes for /feed.xml and /sitemap.xml. 2. Build RSS 2.0 XML without a feed package from an explicit Post::published() query ordered newest-first, generating named post links, RFC 2822 publication dates, descriptions, and WebP cover enclosures resolved through the configured blog image disk. 3. Build the Spatie sitemap from named absolute URLs for home, blog index, now, uses, cv, and style-guide, then append every explicitly published post URL. 4. Add focused PHPUnit feature tests that parse both XML responses, verify content types, fields, ordering/static URLs, and prove drafts and future-dated posts remain excluded even for an authenticated author. 5. Run the targeted tests, Pint, PHPStan, and Rector checks required by the ticket, then update acceptance criteria and completion notes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Investigation (2026-08-03): prerequisites JOEY-1 and JOEY-3 are complete; spatie/laravel-sitemap 8.2.0 is installed. Current public routes are home, blog index/show, now, uses, cv, and the public style-guide colophon; now-playing is JSON and auth/admin/settings routes should not be indexed. Post::published() explicitly enforces published_at != null and <= now, which both endpoints must call even for authenticated requests because the guest visibility global scope opens for the author. Cover images are object keys resolved through config('blog.image_disk')/Storage and are normalized to WebP per ADR 0002. The legacy FeedController hand-builds RSS and the legacy sitemap used a route closure; the new implementation should use named route URLs and dedicated controllers, with feature tests that parse/assert the XML. Working tree was clean at investigation start.

Implementation completed per the approved plan. Both endpoints use the explicit Post::published() scope so author authentication cannot expose drafts or scheduled posts. RSS values are XML-safe, including CDATA terminator handling, and cover enclosures resolve through the configured image disk as image/webp. Validation: 4 targeted tests / 46 assertions passed; composer fmt, composer lint, composer refactor:check, and composer validate passed; LSP and pi-lens reported no findings in changed source files.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented the public RSS feed and sitemap endpoints. Added an RSS 2.0 controller that emits published posts newest-first with title, named-route link/guid, description, RFC 2822 publication date, and configured WebP cover enclosure while safely encoding XML content. Added a Spatie-backed sitemap controller covering home, blog, now, uses, CV, style-guide, and all published post URLs. Registered named /feed.xml and /sitemap.xml routes and added focused PHPUnit coverage proving valid XML, metadata and ordering, static URL coverage, and draft/scheduled exclusion even for an authenticated author.

Validation: `php artisan test --compact tests/Feature/Blog/FeedTest.php tests/Feature/Blog/SitemapTest.php` (4 tests, 46 assertions), `composer fmt`, `composer lint`, `composer refactor:check`, `composer validate --no-check-publish`, LSP diagnostics, and pi-lens diagnostics all pass.
<!-- SECTION:FINAL_SUMMARY:END -->
