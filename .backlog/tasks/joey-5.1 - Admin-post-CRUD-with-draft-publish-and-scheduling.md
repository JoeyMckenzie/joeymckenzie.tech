---
id: JOEY-5.1
title: 'Admin post CRUD with draft, publish, and scheduling'
status: Done
assignee: []
created_date: '2026-07-29 23:15'
updated_date: '2026-07-31 22:09'
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
modified_files:
  - app/Enums/PostStatus.php
  - app/Http/Controllers/Admin/PostController.php
  - app/Http/Controllers/Concerns/HasCoverUrl.php
  - app/Http/Controllers/HomeController.php
  - app/Http/Requests/Admin/PostRequest.php
  - app/Models/Post.php
  - app/Models/PostReaction.php
  - app/Models/PostView.php
  - app/Models/Tag.php
  - app/Models/User.php
  - app/Services/PostImporter.php
  - app/Support/BlogCache.php
  - app/Support/ReadingTime.php
  - composer.json
  - database/migrations/2026_07_31_212841_make_posts_image_nullable.php
  - routes/admin.php
  - routes/web.php
  - resources/js/components/admin/delete-post-dialog.tsx
  - resources/js/components/admin/post-form.tsx
  - resources/js/components/app-sidebar.tsx
  - resources/js/components/nav-main.tsx
  - resources/js/components/ui/table.tsx
  - resources/js/components/ui/textarea.tsx
  - resources/js/pages/admin/posts/create.tsx
  - resources/js/pages/admin/posts/edit.tsx
  - resources/js/pages/admin/posts/index.tsx
  - resources/js/types/admin.ts
  - resources/js/types/index.ts
  - tests/Feature/Admin/PostDestroyTest.php
  - tests/Feature/Admin/PostIndexTest.php
  - tests/Feature/Admin/PostStoreTest.php
  - tests/Feature/Admin/PostUpdateTest.php
  - tests/Unit/Support/ReadingTimeTest.php
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
- [x] #1 Auth + verified-gated routes list, create, edit, and delete posts; guests are denied/redirected
- [x] #2 Creating or editing a post persists title, editable unique slug, description, tag, cover image reference, and content; on save content_html is rendered and reading_time_minutes computed
- [x] #3 Draft, publish, and schedule are supported via published_at (save as draft, publish now, or schedule a future go-live)
- [x] #4 Deleting a post cascades its views and reactions
- [x] #5 Feature tests cover auth gating, create/edit/delete, slug uniqueness and editability, and draft/publish/schedule transitions
- [x] #6 composer fmt, lint, and refactor checks pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Approved 2026-07-31. Admin post CRUD at `/admin/posts`, shadcn AppLayout chrome (Nocturne stays public-only).

## Decisions (approved)

- **A. `/admin/posts`, bound by id.** `App\Http\Controllers\Admin\PostController` (mirrors `Settings\*`); routes in new `routes/admin.php` required from `web.php` (mirrors `settings.php`); names `admin.posts.*`; Inertia pages `admin/posts/{index,create,edit}`. Routes use `{post:id}` NOT the model's `slug` route key, so admin URLs survive slug renames. Page names must avoid the `blog/` prefix or `app.tsx`'s resolver hands them `PublicLayout`.
- **B. Forward migration: `posts.image` -> nullable.** Column is currently NOT NULL with no default, blocking draft-before-cover. `HasCoverUrl::coverUrl()` already maps `blank() -> null`; `BlogPost.cover` is already `string | null`. New migration with `->change()`; the create_posts_table migration is NOT touched.
- **C. `App\Enums\PostStatus` = Draft | Published | Scheduled.** Form/display concern only, NOT a column; `published_at` remains the single source of truth. Drives `Rule::enum()`, the `published_at` mapping, and the index badge. Mapping: Draft -> null; Published -> keep an existing past `published_at`, else `now()` (re-editing a published post never bumps its date); Scheduled -> required, `after:now`.
- **D. Extract `App\Support\ReadingTime::forMarkdown(string): int`** from the private `PostImporter::readingTime()` (200 wpm, `max(1, ceil(...))`) and repoint `PostImporter`. `PostImporterTest` only asserts `> 0`, so it cannot break.
- **E. Cover upload is in 5.1.** AC #2 says "cover image reference" and `ImageProcessor` shipped with JOEY-7: `store($file, $slug, 'cover')`, persist `['key']`. JOEY-5.2 keeps CodeMirror + preview endpoint + *inline body* images.
- **F. `Cache::forget('home:recent_posts')` on every write** — `HomeController` caches recent posts 5 min, so publishing would otherwise look broken for up to 5 min.
- **G. Out of scope:** pagination (32 posts), an admin `show` (public blog is the show page), policies/gates/roles (ADR 0003 -- middleware IS the authorization), and touching `User`/`MustVerifyEmail`.

## Known caveat

`App\Models\User` does not implement `MustVerifyEmail` (import commented out, `User.php:7`), so `verified` currently degrades to a plain `auth` check. Routes still get `['auth','verified']` per convention and the guest redirect is tested, but no test asserts unverified-user blocking because that is not true yet. Separate task if wanted.

## Steps

1. Backend prerequisites (inline, in order): migration (image nullable) -> `Enums/PostStatus` -> `Support/ReadingTime` + repoint `PostImporter` -> `Http/Requests/Admin/PostRequest` -> `Http/Controllers/Admin/PostController` -> `routes/admin.php` + require from `web.php`.
   - One `PostRequest` for store+update; `Rule::unique('posts','slug')->ignore($this->route('post'))` no-ops on create (the `ProfileValidationRules` pattern). Slug falls back to `Str::slug($title)` when blank.
   - Controller ctor-injects `MarkdownRenderer` + `ImageProcessor`. Explicit `select()` + `with('tag:id,name')` because `Model::shouldBeStrict()`. Only ever pass `validated()` (`Model::unguard()` is on).
2. `composer types:generate` (Wayfinder) so `Admin/PostController.ts` exists for the frontend.
3. Fan out in parallel: (a) frontend pages/components, (b) feature + unit tests.
   - Frontend: `ui/table.tsx` + `ui/textarea.tsx` (shadcn CLI, Base UI variant); `types/admin.ts` (`AdminPostRow`, `PostStatus`); `pages/admin/posts/{index,create,edit}.tsx`; `components/admin/post-form.tsx` (the single seam 5.2 swaps CodeMirror into); `components/admin/delete-post-dialog.tsx` (the `delete-user.tsx` Dialog+Form pattern); nav entry in `app-sidebar.tsx`; `nav-main.tsx` `isCurrentUrl` -> `isCurrentOrParentUrl` so `/admin/posts/create` keeps Posts lit. Forms use `<Form {...PostController.action.form()}>` (`useForm` appears nowhere in the repo). Index orders by `updated_at desc`. Toasts are free via existing `flash.toast` -> `useFlashToast`.
   - Tests: `tests/Feature/Admin/{PostIndexTest,PostStoreTest,PostUpdateTest,PostDestroyTest}.php` + `tests/Unit/Support/ReadingTimeTest.php`. Guest redirect; drafts/scheduled visible in admin list; create/edit persistence incl. `content_html` + `reading_time_minutes`; slug uniqueness + editability + view/reaction FK survival across rename; all three status transitions incl. "publish does not bump an existing date"; cascade on delete. `PostFactory` already has `draft()`/`published()`/`scheduled()`.
4. Drive-by (approved): fix `composer.json` `test` script -> `@refactor:check` (it calls the nonexistent `@rector:check` and aborts before phpstan).
5. Verify: `composer fmt:check && composer refactor:check && composer lint && php artisan test`, `pnpm lint:check && pnpm fmt:check && pnpm types:check`, `php artisan ide-helper:models -RW` for the nullable `image` docblock.

## Standing convention reaffirmed

All data changes are forward-only migrations. Never edit an applied migration; never `migrate:fresh`/reset the dev database.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
**Two bugs found by verification, both fixed.**

1. `Arr::integer($validated, 'tag_id')` in `PostController::fill()` threw `InvalidArgumentException` (HTTP 500) on every real form submit, because a browser sends `tag_id` as the string `"1"` and the `integer` validation rule accepts numeric strings without casting. Every feature test passed an int, so the whole suite was green while the UI was 100% broken. Fixed at the request boundary in `PostRequest::prepareForValidation()` (`is_numeric` guard then cast), so a form post and a test payload are indistinguishable downstream. Added `PostStoreTest::it_accepts_a_string_tag_id_the_way_a_browser_form_submits_it` as the regression guard.

2. The save button never submitted. Base UI's `useButton` hardcodes `type: 'button'` for native buttons (`node_modules/@base-ui/react/internals/use-button/useButton.js:167`), and `otherExternalProps` is merged last, so an explicit `type="submit"` is required. Fixed on `PostForm`'s submit button. This is why the pre-existing `delete-user.tsx` uses `render={<button type="submit"/>}`.

**Migration gotcha worth remembering:** the artisan-generated migration stub was executed while its body was still `//`, so `migrate` recorded it in batch 2 as a no-op and then reported "Nothing to migrate" while `posts.image` stayed NOT NULL. Caught by querying INFORMATION_SCHEMA rather than trusting `migrate:status`. Corrected by un-recording and re-running that single migration; its `down()` was a no-op against the live schema, so no data moved. **Always verify a `->change()` migration against the actual column, not the migration log.**

**Design decisions as built** (all approved up front):
- `/admin/posts` bound on `{post:id}`, not Post's `slug` route key, so admin URLs survive slug renames. Routes in `routes/admin.php`, required from `web.php` alongside `settings.php`.
- `posts.image` made nullable by forward migration so a draft can be saved before a cover exists. `HasCoverUrl::coverUrl()` widened to `?string`.
- `PostStatus` (Draft|Published|Scheduled) is a form/display concern only; `published_at` stays the single source of truth. `publishedAt()` preserves an already-past date on re-publish but moves a scheduled post forward to now.
- `ReadingTime::forMarkdown()` extracted from `PostImporter`'s private method; `PostImporter` repointed at it.
- `BlogCache::RECENT_POSTS` + `forgetRecentPosts()` shared with `HomeController`, called on every write so publishing is not hidden by the 5-minute home cache.
- Cover upload runs `ImageProcessor::store($file, $slug, 'cover')` and persists the R2 object key, per ADR 0002.
- No policies or gates: with one account, `['auth','verified']` is the authorization (ADR 0003).
- Content is a plain `<textarea>`, deliberately isolated in `components/admin/post-form.tsx` as the single seam JOEY-5.2 swaps CodeMirror into.
- `tag_id` uses the existing Base UI `ui/select.tsx`, which renders a real named hidden input, so no native `<select>` fallback was needed.

**Verification.** `composer test` (pint + rector + phpstan level max + phpunit) fully green: 129 tests, 599 assertions. `pnpm fmt:check`, `lint:check`, `types:check` all clean. `composer test` itself was also repaired — it invoked the nonexistent `@rector:check` and aborted before phpstan; now `@refactor:check`.

Browser smoke test of the real UI, end to end: created a draft (title `Smoke Test: A Post From The Admin!` live-slugified to `smoke-test-a-post-from-the-admin`, `tag_id` persisted as int 4, `image` null, `content_html` rendered to `<h1>/<strong>/<ul>`, `reading_time_minutes` 1) -> published it and confirmed a cookieless guest gets HTTP 200 -> rescheduled to 2027-03-01 09:30 and confirmed the guest then gets 404 -> submitted a past date and got the inline error "The published at field must be a date after now." -> attached 2 views and 1 reaction, deleted via the dialog, and confirmed `posts`/`post_views`/`post_reactions` rows for that id are all 0. Post count back to 32, no residue.

**Out of scope, found while verifying — pre-existing bug worth its own task.** `settings/profile.tsx` and `settings/security.tsx` have non-functional Save buttons for the same Base UI reason as #2 above: a plain `<Button>` inside `<Form>` renders `type="button"`. Proved at the network level — clicking the shipped Save button fired no request at all, while a direct `form.requestSubmit()` produced `POST /settings/profile` and the "Profile updated." toast. Almost certainly regressed in the Radix -> Base UI migration. One-prop fix per button; deliberately not touched here.

Also unrelated: `config/inertia.php` has `ssr.enabled=true` pointing at 127.0.0.1:13714, which is not listening in dev, so pages ship as an empty `#app` plus client hydration locally.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Admin post CRUD is live at `/admin/posts` behind `auth` + `verified`: list, create, edit, delete, with draft / publish now / schedule driven by `published_at` and no status column. Slugs are generated from the title, editable, unique, and normalised server-side; renaming one leaves views and reactions attached because they key on `post_id`. Every save re-renders `content_html` through `MarkdownRenderer` and recomputes `reading_time_minutes` via the newly extracted `ReadingTime`. Cover uploads run the existing R2 + Intervention pipeline and store the object key; a forward migration made `posts.image` nullable so drafts can be saved before a cover exists. Deleting a post cascades its views and reactions in the database.

34 new tests (129 total, 599 assertions) cover auth gating, draft/scheduled visibility to an authed admin, persistence and derivation, slug uniqueness + self-slug + rename-without-orphaning, all three status transitions including the rule that re-publishing a live post never re-dates it, and cascade delete. phpstan at level max, rector, and pint are clean, as are prettier, eslint, and tsc.

Verification caught two bugs the test suite could not: `tag_id` arriving as a string from a real form crashed `Arr::integer` on every UI submit, and Base UI's hardcoded `type="button"` meant the save button never submitted at all. Both fixed, the first with a regression test at the layer that missed it. The markdown field is deliberately a plain textarea isolated in `PostForm` — the seam JOEY-5.2 swaps CodeMirror and the server-rendered preview into.
<!-- SECTION:FINAL_SUMMARY:END -->
