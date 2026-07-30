---
id: JOEY-13
title: Port public site pages to Nocturne
status: To Do
assignee: []
created_date: '2026-07-30 18:32'
labels:
  - frontend
  - design
milestone: m-3
dependencies: []
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the old website's non-blog public pages into the new Nocturne-themed Inertia/React site so the site is complete and deployable before post-authoring CRUD (JOEY-5). This is a redesign to fit Nocturne (see docs/design/nocturne.md), NOT a pixel-port of the old, Framer-Motion-heavy site.

First-deploy scope (this parent): shared public layout, home, now/uses/cv, error page, and the Spotify now-playing footer widget. The guestbook is intentionally a SEPARATE deferred task (needs a GitHub OAuth app + Socialite) and is not part of this parent.

Design constraints for all subtasks: use the Nocturne tokens/primitives (bg-canvas/text-prose/text-iris, font-display Fraunces, font-mono Geist Mono, the first-light sweep, PostCard). Motion is Nocturne-restrained — the first-light sweep per page + a subtle one-shot scroll fade — with NO Framer Motion and prefers-reduced-motion respected. Old site reference (read-only): ../joeymckenzie.tech.old/main (pages under resources/js/Pages, shared chrome at resources/js/layouts/blog-layout.tsx).
<!-- SECTION:DESCRIPTION:END -->
