---
id: JOEY-2
title: 'Disable public registration and add a users:create command'
status: Done
assignee: []
created_date: '2026-07-29 23:12'
updated_date: '2026-07-29 23:33'
labels:
  - backend
  - auth
milestone: m-0
dependencies: []
references:
  - docs/adr/0003-no-public-registration-single-operator-user.md
  - ../../doghead-digital-web/bidscope/app/Console/Commands/CreateUser.php
modified_files:
  - app/Console/Commands/CreateUser.php
  - app/Providers/FortifyServiceProvider.php
  - config/fortify.php
  - resources/js/pages/auth/login.tsx
  - resources/js/pages/auth/register.tsx
  - resources/js/pages/welcome.tsx
  - tests/Feature/Auth/RegistrationTest.php
  - tests/Feature/Console/CreateUserCommandTest.php
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
- [x] #1 Fortify's registration feature is disabled and the register route plus resources/js/pages/auth/register.tsx are removed; requesting /register returns 404
- [x] #2 A users:create artisan command creates a user via Fortify's CreateNewUser action, accepts --name/--email/--password flags, prompts for any omitted value, and marks the email as verified
- [x] #3 Login, password reset, 2FA, and passkeys remain functional (not broken by removing registration)
- [x] #4 Feature tests cover: the registration endpoint is unavailable, and users:create creates a verified user while surfacing CreateNewUser validation errors on bad input
- [x] #5 composer fmt, lint, and refactor checks pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Disable Fortify registration, remove its Inertia page and public signup links, then regenerate Wayfinder routes. 2. Add a Laravel 13 attribute-based users:create command that delegates validation and persistence to Fortify's CreateNewUser action, prompts for omitted options, and verifies the created email. 3. Update registration coverage, add command feature tests, verify remaining auth routes/tests, and run all PHP/frontend quality gates.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Disabled Fortify registration, removed the registration page and public signup links, and regenerated Wayfinder routes without registration helpers. Added an attribute-based users:create command that accepts flags, prompts for omitted values, delegates to Fortify's CreateNewUser validation, marks email verified, and reports validation failures. Added focused tests and verified login, password reset, 2FA, passkeys, PHP/frontend quality checks, and the production build.
<!-- SECTION:FINAL_SUMMARY:END -->
