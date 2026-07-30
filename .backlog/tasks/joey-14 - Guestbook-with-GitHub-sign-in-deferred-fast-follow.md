---
id: JOEY-14
title: Guestbook with GitHub sign-in (deferred fast-follow)
status: To Do
assignee: []
created_date: '2026-07-30 18:33'
updated_date: '2026-07-30 18:34'
labels:
  - frontend
  - backend
milestone: m-3
dependencies:
  - JOEY-13.1
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the guestbook: anonymous visitors sign in with GitHub to leave a short message; entries are listed most-recent-first; authors can delete their own. Intentionally deferred out of the first public-site deploy (JOEY-13) because it needs a registered GitHub OAuth app + Socialite — build it as a fast-follow once the OAuth app exists.

Backend: install laravel/socialite; add GITHUB_CLIENT_ID/SECRET/REDIRECT env + a `github` block in config/services.php; a GithubController redirect/callback that stores the visitor's GitHub identity (username + avatar) in the session (this is a lightweight visitor identity, NOT the operator User account — public registration stays disabled); a guestbook_entries migration + model (github_username, github_avatar, body ≤280, timestamps); a GuestbookController index/store (throttle:10,1)/destroy (author-scoped by github_username). Frontend: a Nocturne guestbook page inside PublicLayout — sign-in-with-GitHub button when signed out; an entry form with a 280-char counter when signed in; the entries list with avatar/username/formatted date and an author-only delete; empty state. Add a nav/footer link once shipped. Old reference: ../joeymckenzie.tech.old/main/{app/Http/Controllers/GuestbookController.php, app/Http/Controllers/Auth/GithubController.php, app/Models/GuestbookEntry.php, database/migrations/2026_03_29_210552_create_guestbook_entries_table.php, resources/js/Pages/guestbook.tsx}.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A visitor can sign in with GitHub (Socialite); their GitHub identity is stored in the session and sign-out clears it; this is separate from the operator User and does not re-enable registration
- [ ] #2 A signed-in visitor can post an entry (<=280 chars, throttled 10/min); the list shows all entries most-recent-first with avatar, username, and formatted date
- [ ] #3 An author can delete only their own entries; deleting another author's entry is rejected
- [ ] #4 guestbook_entries has no foreign key to the operator User; the page renders inside PublicLayout, responsive and dark/light aware
- [ ] #5 Tests cover posting, the 280-char limit, throttling, author-scoped delete, and unauthorized-delete rejection
- [ ] #6 composer fmt/lint/refactor and frontend format/lint/type checks pass
<!-- AC:END -->
