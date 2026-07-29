---
id: JOEY-7
title: Image processing pipeline to R2
status: To Do
assignee: []
created_date: '2026-07-29 23:14'
labels:
  - backend
  - infra
milestone: m-1
dependencies:
  - JOEY-1
references:
  - docs/adr/0002-images-on-r2-normalized-to-webp.md
priority: high
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A reusable service that normalizes an image and stores it on the Cloudflare R2 disk, used by both the import backfill and the admin editor upload (docs/adr/0002). Given an image source (local path, uploaded file, or raw bytes), cap width at 1600px, optimize to WebP (~quality 70) via the Laravel 13 Image facade (intervention/image), and store it publicly on the R2 disk under posts/{slug}/…, returning both the object key and the resolvable public URL. Requires GD or Imagick (provisioned in JOEY-1). No responsive/multi-size variants — a single optimized WebP per image.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A service accepts an image (uploaded file, local path, or bytes), scales to max width 1600, converts to WebP (~q70), and stores it publicly on the R2 disk under posts/{slug}/, returning the object key and the resolvable public URL
- [ ] #2 Input of any format is normalized to a .webp object
- [ ] #3 Tests using a fake disk prove a stored object exists at the expected key, is WebP, and the returned URL resolves via the disk
- [ ] #4 composer fmt, lint, and refactor checks pass
<!-- AC:END -->
