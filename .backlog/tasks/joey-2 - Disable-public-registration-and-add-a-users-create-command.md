---
id: JOEY-2
title: 'Disable public registration and add a users:create command'
status: To Do
assignee: []
created_date: '2026-07-29 23:12'
labels:
  - backend
  - auth
milestone: m-0
dependencies: []
references:
  - docs/adr/0003-no-public-registration-single-operator-user.md
  - ../../doghead-digital-web/bidscope/app/Console/Commands/CreateUser.php
priority: high
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
This is a single-author site: the only account that ever logs in is the owner, into the admin (docs/adr/0003). Remove open signup so a self-registered user can never reach an admin gated only on auth(), and provide a CLI path to create the operator user (there is no public sign-up to bootstrap it).

Model the command on bidscope's CreateUser at ../../doghead-digital-web/bidscope/app/Console/Commands/CreateUser.php, minus the teams logic: use Laravel 13 attribute-based command signature, run inputs through Fortify's CreateNewUser action for identical validation, then mark the email verified (no mail round-trip for the operator creating their own account). Accept all inputs as flags so it runs non-interactively from the Laravel Cloud Artisan UI, prompting (Laravel Prompts) for anything omitted.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Fortify's registration feature is disabled and the register route plus resources/js/pages/auth/register.tsx are removed; requesting /register returns 404
- [ ] #2 A users:create artisan command creates a user via Fortify's CreateNewUser action, accepts --name/--email/--password flags, prompts for any omitted value, and marks the email as verified
- [ ] #3 Login, password reset, 2FA, and passkeys remain functional (not broken by removing registration)
- [ ] #4 Feature tests cover: the registration endpoint is unavailable, and users:create creates a verified user while surfacing CreateNewUser validation errors on bad input
- [ ] #5 composer fmt, lint, and refactor checks pass
<!-- AC:END -->
