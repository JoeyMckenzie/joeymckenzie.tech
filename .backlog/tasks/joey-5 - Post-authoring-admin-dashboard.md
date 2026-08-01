---
id: JOEY-5
title: Post authoring admin dashboard
status: In Progress
assignee: []
created_date: '2026-07-29 23:12'
updated_date: '2026-08-01 16:41'
labels:
  - frontend
  - backend
  - admin
milestone: m-4
dependencies: []
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Parent task. An auth-gated (auth + verified) admin where the owner writes and manages posts. Authoring is markdown-source with a server-rendered live preview that is byte-identical to the published page (docs/adr/0004), image upload runs the R2 + Intervention pipeline (docs/adr/0002), and posts support draft/publish/scheduling. Tags can be created inline from the editor. Subtasks break down post CRUD, the editor + preview + image upload, and inline tag creation. Depends on the data layer and the auth hardening from the Foundation milestone.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
All three subtasks are complete: JOEY-5.1 admin post CRUD and publication states, JOEY-5.2 CodeMirror/server preview/image upload, and JOEY-5.3 inline normalized tag creation.

JOEY-5.4 added after browser verification showed post create/update flash payloads were not consistently surfacing as visible toasts. Parent reopened until the follow-up is complete.
<!-- SECTION:NOTES:END -->
