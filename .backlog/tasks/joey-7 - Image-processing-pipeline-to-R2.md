---
id: JOEY-7
title: Image processing pipeline to R2
status: Done
assignee: []
created_date: '2026-07-29 23:14'
updated_date: '2026-07-30 17:29'
labels:
  - backend
  - infra
milestone: m-1
dependencies:
  - JOEY-1
references:
  - docs/adr/0002-images-on-r2-normalized-to-webp.md
modified_files:
  - app/Services/ImageProcessor.php
  - tests/Feature/Blog/ImageProcessorTest.php
priority: high
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A reusable service that normalizes an image and stores it on the Cloudflare R2 disk, used by both the import backfill and the admin editor upload (docs/adr/0002). Given an image source (local path, uploaded file, or raw bytes), cap width at 1600px, optimize to WebP (~quality 70) via the Laravel 13 Image facade (intervention/image), and store it publicly on the R2 disk under posts/{slug}/…, returning both the object key and the resolvable public URL. Requires GD or Imagick (provisioned in JOEY-1). No responsive/multi-size variants — a single optimized WebP per image.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A service accepts an image (uploaded file, local path, or bytes), scales to max width 1600, converts to WebP (~q70), and stores it publicly on the R2 disk under posts/{slug}/, returning the object key and the resolvable public URL
- [x] #2 Input of any format is normalized to a .webp object
- [x] #3 Tests using a fake disk prove a stored object exists at the expected key, is WebP, and the returned URL resolves via the disk
- [x] #4 composer fmt, lint, and refactor checks pass
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
`App\Services\ImageProcessor` — the shared image pipeline for the import (JOEY-11) and admin upload (JOEY-5.2).

`store(UploadedFile|string $source, string $slug, ?string $name = null): array` accepts an uploaded file, a local path, or raw bytes (dispatched via the Laravel 13 `Image` facade: `fromUpload`/`fromPath`/`fromBytes`), scales down to max width 1600 (never upscales), re-encodes to WebP (~q70, `optimize()` = format + quality, no external binaries), and stores publicly on the `r2` disk under `posts/{slug}/{name}.webp`. Returns `['key' => object key, 'url' => Storage::disk('r2')->url(key)]` — cover records keep the key, inline prose uses the URL (ADR 0002).

Path/bytes dispatch guards against null bytes so raw image data (which contains them) is never mistaken for a file path.

Tests (fake disk, 4): uploaded image → capped WebP object at the expected key with a resolving URL and width ≤ 1600; any format normalised to WebP; small images not upscaled; raw-bytes and local-path inputs both stored. Full suite 73/73 (313 assertions); pint/phpstan/rector pass.

With JOEY-6 + JOEY-7 done, **JOEY-11 (posts:import backfill) is now unblocked** — its remaining need is the legacy images in ../joeymckenzie.tech.old/main/public/assets/images.
<!-- SECTION:FINAL_SUMMARY:END -->
