---
id: JOEY-13.2
title: 'Home page (Nocturne): hero + recent posts'
status: Done
assignee: []
created_date: '2026-07-30 18:32'
updated_date: '2026-07-30 19:40'
labels:
  - frontend
  - design
milestone: m-3
dependencies:
  - JOEY-13.1
  - JOEY-8
parent_task_id: JOEY-13
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Redesigned home at `/` in Nocturne. Lead with a typographic Fraunces hero (a one-line thesis in Joey's voice) + the first-light sweep, a short two-line bio, social links, then the 3 most-recent published posts as PostCards. A Home controller returns the 3 recent posts using the Post `published()` scope (lightweight columns only) mapped to the same shape PostCard/BlogController use. The implementer should draft 2-3 hero-line options in Joey's register (irreverent, meme-aware) for Joey to pick. Old reference: ../joeymckenzie.tech.old/main/resources/js/Pages/home.tsx + app/Http/Controllers/HomeController.php (which cached recent posts ~5 min).
<!-- SECTION:DESCRIPTION:END -->

## Hero line options

1. **Software engineer. Professional rabbit-hole diver.** — selected
2. I write code so you don't have to read the docs.
3. Terminally curious. Currently building with PHP and Rust.

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 `/` renders a Nocturne hero (Fraunces headline + first-light sweep), a short bio, social links, and the 3 most-recent published posts as PostCards linking to each post
- [x] #2 Recent posts come from a controller using the published() scope with lightweight columns, reasonably cached
- [x] #3 Renders inside PublicLayout; responsive and dark/light aware
- [x] #4 A feature test asserts the home page returns the expected recent-posts shape/count and excludes drafts and future-dated posts
- [x] #5 composer fmt/lint/refactor and frontend format/lint/type checks pass
<!-- AC:END -->
