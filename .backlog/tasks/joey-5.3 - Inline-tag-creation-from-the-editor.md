---
id: JOEY-5.3
title: Inline tag creation from the editor
status: Done
assignee:
  - Joey McKenzie
created_date: '2026-07-29 23:16'
updated_date: '2026-08-01 16:41'
labels:
  - frontend
  - backend
  - admin
milestone: m-4
dependencies:
  - JOEY-5.1
  - JOEY-3
modified_files:
  - app/Http/Controllers/Admin/PostController.php
  - app/Http/Requests/Admin/PostRequest.php
  - resources/js/components/admin/post-form.tsx
  - resources/js/components/ui/select.tsx
  - tests/Feature/Admin/PostStoreTest.php
parent_task_id: JOEY-5
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Allow creating a new tag on the fly while authoring a post, so writing about a new topic doesn't require a code deploy (this was the agreed tags decision — seed the known nine, create the rest inline; deleting/renaming tags is out of scope). The post editor's tag control supports creating a tag by name that is immediately assignable to the post. Depends on admin CRUD (JOEY-5.1) and the Tag model (JOEY-3).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The post editor's tag control can create a new tag by name and assign it to the post in the same flow
- [x] #2 New tag names are normalized (lowercase, unique); an existing name reuses the existing tag rather than duplicating
- [x] #3 A feature test proves creating a post with a brand-new tag creates the tag and associates it
- [x] #4 composer fmt/lint/refactor and frontend lint checks pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Approved 2026-08-01.

## Approach

Keep tag creation inside the existing post create/update submission rather than adding a separate endpoint. This makes a brand-new tag and its post association one authoring flow, matching AC #1 and the feature-test wording in AC #3.

1. Replace the fixed tag `Select` in `resources/js/components/admin/post-form.tsx` with the existing styled `Input` backed by a native `datalist`. The field submits `tag_name`, offers every existing tag as a suggestion, and still accepts a new free-form name. This avoids a dependency and avoids misusing Base UI Combobox, whose documented contract restricts input to predefined items.
2. Extend `App\Http\Requests\Admin\PostRequest` to accept either the legacy `tag_id` contract or `tag_name`. Normalize a submitted name with `Str::slug()` before validation, yielding the lowercase URL-safe representation required by JOEY-3. Keep `tag_id` support so the completed JOEY-5.1 backend contract and regression tests remain valid.
3. Resolve the post tag in `App\Http\Controllers\Admin\PostController`: use the validated existing id when supplied, otherwise `Tag::firstOrCreate()` by normalized name. The database's existing unique index remains the final uniqueness guarantee; no migration is needed. The same shared request/controller fill path covers create and update.
4. Update frontend validation display and form defaults so editing begins with the post's current tag name while both create and edit can type a new one.
5. Extend `tests/Feature/Admin/PostStoreTest.php` with coverage that a brand-new mixed-case/spaced name is normalized, created, and associated, and that a differently formatted existing name is reused without a duplicate. Preserve existing invalid-id and browser-string-id tests. Add update coverage only if the shared-path tests reveal a gap.
6. Verify with the focused admin post tests, `vendor/bin/pint --dirty --format agent`, repository Composer format/lint/refactor checks, frontend format/lint/type checks, and a final diagnostics pass.

## Scope boundaries

No tag rename/delete management, standalone tag endpoint, migration, model-property change, or new frontend dependency.

## Revision after UI verification — 2026-08-01

The native `datalist` does not reliably expose the existing tag list in the actual admin UI. Replace it with the already-installed Base UI `Select`, which was known to display existing tags, and add an explicit `Create a new tag…` option. Selecting that option reveals the styled `tag_name` input; selecting an existing item submits `tag_id`. Keep the backend either-id-or-name contract and all normalization/reuse behavior unchanged. Add state only inside `PostForm`, preserve the current tag on edit, then rerun frontend checks, focused feature tests, the production build, and the full suite.

## Select overlay correction — 2026-08-01

Screenshot verification exposed a bug in the migrated `resources/js/components/ui/select.tsx` wrapper, not the post-form composition. Compared with the current official shadcn Base UI Select source, the local wrapper defaults `alignItemWithTrigger` to false, constrains `SelectPrimitive.List` to `h-[var(--anchor-height)]` (one trigger-row tall), omits the Positioner's overlay stacking class, and does not size the popup to the anchor. Bring `SelectContent` back to the official Base UI anatomy while preserving this project's visual classes: default aligned-to-trigger positioning, `isolate z-50` on Positioner, anchor-width Popup, and an unconstrained padded List. The Select has only one consumer (`PostForm`), so verify that dropdown plus the existing frontend/full-suite checks.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-08-01: Resuming after JOEY-5.2. Reviewing the completed editor work, JOEY-5.1/JOEY-3 contracts, and recent commits before proposing the JOEY-5.3 implementation plan. No code changes started.

Implementation complete. The editor now submits a free-form `tag_name` from the existing styled Input with native datalist suggestions. PostRequest normalizes names with `Str::slug()`, while retaining the legacy `tag_id` request path; PostController resolves normalized names with `Tag::firstOrCreate()`. No endpoint, migration, model annotation change, or frontend dependency was needed.

Focused tests caught that Laravel 13 has no `prohibited_with` validation rule. The unsupported rule was removed; `required_without` provides the intended either-id-or-name compatibility, and the shipped UI submits only `tag_name`.

Verification: PostStoreTest 18 tests / 55 assertions; PostUpdateTest 10 tests / 40 assertions; full `composer test` 148 tests / 675 assertions. Composer validation, Pint, Rector, PHPStan, Prettier, ESLint, TypeScript, Vite production build, LSP diagnostics, pi-lens diagnostics, and `git diff --check` all pass. The first full-suite attempt exposed a stale Vite manifest rather than an application failure; `pnpm run build` regenerated it and the complete suite then passed.

User verification found the native datalist did not show the existing tag list. JOEY-5.3 reopened to replace that browser-dependent control with the installed Base UI Select plus an explicit create-new path.

UI follow-up complete. Replaced the unreliable native datalist with the existing Base UI Select. The menu now renders every existing tag plus a separate `Create a new tag…` item; choosing it removes the select's `tag_id` field and reveals the required `tag_name` input, so the request still submits exactly the intended path. Edit forms initialize the controlled select from the post's current tag.

Follow-up verification: Prettier, ESLint, TypeScript, Vite production build, focused PostStore/PostUpdate tests, full `composer test` (148 tests, 675 assertions), LSP/pi-lens diagnostics, and `git diff --check` all pass.

Screenshot review confirmed the menu was being clipped to one row by the migrated Select wrapper's `h-[var(--anchor-height)]` list class. The local `components.json` still identifies the legacy Radix style while wrappers use Base UI, so the CLI's default Radix diff is not a valid golden source; the current official shadcn Base UI Select source was fetched directly and used for the wrapper correction.

Select overlay correction verified by the user. The wrapper now matches current shadcn Base UI positioning conventions: aligned to trigger by default, Positioner owns overlay stacking, Popup matches anchor width, and List is no longer clipped to one trigger-row height. All ten database tags render in the supplied list.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented inline tag creation directly in the existing post create/update flow. The authoring form uses the installed Base UI Select, showing all existing tags plus an explicit `Create a new tag…` option. Selecting that option reveals a required styled name input; selecting an existing item submits its id. Edit forms open with the post's current tag selected.

Corrected the migrated shared Select wrapper against the current official shadcn Base UI anatomy. Its list had been constrained to `h-[var(--anchor-height)]`, clipping the menu to one row; the Positioner also lacked overlay stacking and the Popup did not own the trigger width. The menu now overlays subsequent fields, matches the trigger width, and displays the full tag list.

`PostRequest` accepts either `tag_id` or `tag_name`, normalizes names through `Str::slug()`, and `PostController` uses `Tag::firstOrCreate()` so normalized existing names are reused. Feature tests cover normalized creation/association and deduplication.

Verification is green: full `composer test` (148 tests, 675 assertions), focused store/update tests, Composer validation, Pint, Rector, PHPStan, Prettier, ESLint, TypeScript, Vite production build, LSP/pi-lens diagnostics, and `git diff --check`.
<!-- SECTION:FINAL_SUMMARY:END -->
