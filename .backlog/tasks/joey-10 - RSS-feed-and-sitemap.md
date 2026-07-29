---
id: JOEY-10
title: RSS feed and sitemap
status: To Do
assignee: []
created_date: '2026-07-29 23:14'
labels:
  - backend
milestone: m-2
dependencies:
  - JOEY-1
  - JOEY-3
references:
  - ../joeymckenzie.tech.old/main/app/Http/Controllers/FeedController.php
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the RSS feed and sitemap to the new schema. The feed hand-builds RSS XML (no package) from published posts — port from app/Http/Controllers/FeedController.php in ../joeymckenzie.tech.old/main. The sitemap uses spatie/laravel-sitemap and lists the static pages plus each published post URL. Both iterate published posts via the model scope from JOEY-3 and must exclude drafts and future-dated posts.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GET /feed.xml returns valid RSS listing published posts (title, link, description, pubDate, cover image), newest first
- [ ] #2 GET /sitemap.xml lists the site's static routes and every published post URL
- [ ] #3 Both exclude drafts and future-dated posts
- [ ] #4 Tests assert both endpoints include the expected published posts and exclude unpublished ones
- [ ] #5 composer fmt, lint, and refactor checks pass
<!-- AC:END -->
