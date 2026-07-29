---
id: JOEY-1
title: Add blog dependencies and configure Cloudflare R2 disk
status: Done
assignee: []
created_date: '2026-07-29 23:12'
updated_date: '2026-07-29 23:23'
labels:
  - backend
  - infra
milestone: m-0
dependencies: []
references:
  - docs/adr/0001-mysql-is-the-source-of-truth-for-posts.md
  - docs/adr/0002-images-on-r2-normalized-to-webp.md
modified_files:
  - .env.example
  - composer.json
  - composer.lock
  - config/filesystems.php
  - devenv.nix
  - tests/Feature/Filesystem/R2DiskTest.php
priority: high
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Establish the backend dependencies and object-storage config the blog migration needs before any feature work. The site is moving off Orbit to a MySQL-backed blog (docs/adr/0001) with post images on a Cloudflare R2 bucket attached as a Laravel Cloud resource (docs/adr/0002). Add the approved Composer packages and wire an S3-compatible filesystem disk pointing at that R2 bucket. No user-facing behavior yet — this unblocks the markdown renderer, the import command, and the image pipeline.

Approved dependency set: league/commonmark ^2.7, phiki/phiki ^2.0, spatie/laravel-sitemap ^8.0, spatie/yaml-front-matter, intervention/image ^4, league/flysystem-aws-s3-v3. Laravel Cloud injects the R2 credentials and a stable public base URL at runtime; local/dev reads them from env.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 composer.json requires league/commonmark ^2.7, phiki/phiki ^2.0, spatie/laravel-sitemap ^8.0, spatie/yaml-front-matter, intervention/image ^4, and league/flysystem-aws-s3-v3, and composer install succeeds
- [x] #2 An S3-compatible filesystem disk for the Cloudflare R2 bucket is configured in config/filesystems.php, reading key/secret/bucket/endpoint and public URL from env; the env keys are documented in .env.example
- [x] #3 GD or Imagick is confirmed present in the devenv/local PHP runtime (intervention/image requirement) and noted in the task notes
- [x] #4 A test proves the R2 disk binding resolves and can store then retrieve a file (fake/local disk acceptable in test)
- [x] #5 composer fmt, lint, and refactor checks pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add the approved Composer dependencies and verify the local image extensions. 2. Configure a dedicated R2 filesystem disk and document its environment variables, completing the existing MinIO development environment. 3. Add a filesystem integration test, then run the ticket's formatting, linting, refactor, and targeted test checks.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Local PHP 8.5 runtime confirms both gd and imagick are loaded (php -m). devenv.nix also provisions both extensions explicitly.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added and locked the approved markdown, syntax highlighting, sitemap, front matter, image, and S3 adapter dependencies. Configured a dedicated Cloudflare R2 disk with documented R2 environment variables and completed the existing MinIO development values. Added a PHPUnit write/read test for the disk and verified Composer install, Pint, Rector, PHPStan, GD, and Imagick.
<!-- SECTION:FINAL_SUMMARY:END -->
