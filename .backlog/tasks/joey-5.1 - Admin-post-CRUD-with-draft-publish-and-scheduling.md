---
id: JOEY-5.1
title: 'Admin post CRUD with draft, publish, and scheduling'
status: To Do
assignee: []
created_date: '2026-07-29 23:15'
labels:
  - backend
  - admin
milestone: m-4
dependencies:
  - JOEY-2
  - JOEY-3
  - JOEY-6
references:
  - docs/adr/0003-no-public-registration-single-operator-user.md
parent_task_id: JOEY-5
priority: high
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The admin post-management surface (list, create, edit, delete) behind auth + verified middleware, part of the redesigned admin. Supports draft (null published_at), publish (published_at <= now), and scheduling (future published_at). The slug is generated from the title but editable and unique; changing a slug must not orphan reactions or views (they link by post_id FK per JOEY-3). Content is markdown; on save, content_html is rendered via the MarkdownRenderer (JOEY-6) and reading_time_minutes is computed. The rich editor UI, live preview, and image upload are a separate subtask — this subtask covers routing, authorization, form validation (FormRequest), and persistence.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Auth + verified-gated routes list, create, edit, and delete posts; guests are denied/redirected
- [ ] #2 Creating or editing a post persists title, editable unique slug, description, tag, cover image reference, and content; on save content_html is rendered and reading_time_minutes computed
- [ ] #3 Draft, publish, and schedule are supported via published_at (save as draft, publish now, or schedule a future go-live)
- [ ] #4 Deleting a post cascades its views and reactions
- [ ] #5 Feature tests cover auth gating, create/edit/delete, slug uniqueness and editability, and draft/publish/schedule transitions
- [ ] #6 composer fmt, lint, and refactor checks pass
<!-- AC:END -->
