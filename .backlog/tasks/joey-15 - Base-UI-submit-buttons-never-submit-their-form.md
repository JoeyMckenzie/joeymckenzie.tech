---
id: JOEY-15
title: Base UI submit buttons never submit their form
status: Done
assignee: []
created_date: '2026-07-31 22:11'
updated_date: '2026-07-31 22:17'
labels:
  - frontend
  - bug
dependencies: []
references:
  - resources/js/components/ui/button.tsx
  - node_modules/@base-ui/react/internals/use-button/useButton.js
modified_files:
  - resources/js/pages/auth/confirm-password.tsx
  - resources/js/pages/auth/forgot-password.tsx
  - resources/js/pages/auth/verify-email.tsx
  - resources/js/pages/settings/profile.tsx
  - resources/js/pages/settings/security.tsx
priority: high
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Five submit buttons across auth and settings are dead: clicking them fires no request at all.

Base UI's `useButton` hardcodes `type: 'button'` for native buttons (`node_modules/@base-ui/react/internals/use-button/useButton.js:167`). Radix did not, so a plain `<Button>` inside a `<Form>` used to submit and silently stopped when the project moved to `@base-ui/react`. Because `otherExternalProps` is merged last in that same call, an explicit `type="submit"` prop overrides the default and fixes it.

Proven at the network level, not inferred: on `/settings/profile`, clicking `button[data-test="update-profile-button"]` produced zero non-GET requests, while calling `form.requestSubmit()` directly on the same page produced `POST /settings/profile` and the "Profile updated." toast.

The critical auth paths were already fixed piecemeal — `login.tsx`, `reset-password.tsx`, `two-factor-challenge.tsx`, `manage-two-factor.tsx`, `two-factor-recovery-codes.tsx`, `passkey-register.tsx`, and `two-factor-setup-modal.tsx` all pass `type="submit"` today, and `delete-user.tsx` works around it with `render={<button type="submit"/>}`. These five were missed:

| File | Button |
|---|---|
| `resources/js/pages/settings/profile.tsx:114` | `data-test="update-profile-button"` |
| `resources/js/pages/settings/security.tsx:114` | `data-test="update-password-button"` |
| `resources/js/pages/auth/confirm-password.tsx:46` | `data-test="confirm-password-button"` |
| `resources/js/pages/auth/forgot-password.tsx:42` | `data-test="email-password-reset-link-button"` |
| `resources/js/pages/auth/verify-email.tsx:24` | Resend verification email |

User-visible impact: the profile and password forms cannot be saved, password confirmation cannot be completed (which gates `/settings/security` behind `RequirePassword`), password reset cannot be requested, and the verification email cannot be resent.

Fix is one `type="submit"` prop per button. Deliberately NOT changing `components/ui/button.tsx` to default to submit: that primitive is used for many non-form buttons (sidebar trigger, dialog triggers, nav links), and defaulting it to submit would make every one of them a submitter. Base UI's default is correct for a general-purpose button; the call site is what has intent.

Found while verifying JOEY-5.1, which hit the identical bug on its own save button.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All five buttons carry an explicit type="submit" and submit their form
- [x] #2 Each fixed form is exercised in a browser and observed issuing its request and rendering its success or validation response
- [x] #3 components/ui/button.tsx is left alone so non-form buttons keep Base UI's type="button" default
- [x] #4 pnpm fmt:check, lint:check, and types:check pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Add an explicit `type="submit"` to each of the five dead buttons, then exercise every fixed form in a real browser and observe the request plus its success or validation response. `components/ui/button.tsx` stays untouched. Verify with `pnpm fmt:check`, `lint:check`, `types:check`.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added `type="submit"` to all five buttons. `components/ui/button.tsx` untouched (confirmed via `git diff --stat`), so the sidebar trigger, dialog triggers, and link-style buttons keep Base UI's correct `type="button"` default.

**Each form exercised in a real browser with a network listener attached, not inferred from markup:**

| Form | Observed request | Observed response |
|---|---|---|
| `/forgot-password` | `POST /forgot-password` | "We can't find a user with that email address." |
| `/settings/profile` | `POST /settings/profile` | "Profile updated." toast |
| `/user/confirm-password` | `POST /user/confirm-password` | advanced to `/settings/security` |
| `/settings/password` | `POST /settings/password` | "The password is incorrect." |
| `/email/verification-notification` | `POST /email/verification-notification` | "A new verification link has been sent..." |

Before the fix, the profile button produced **zero** non-GET requests on click.

**Two false alarms worth recording.** Submitting `not-an-email` to forgot-password fired no request, but that was native `type="email"` constraint validation (`checkValidity()` false, "Please include an '@'"), not the button — a valid-format address then submitted fine. And `/verify-email` 404s: Fortify names the route `verification.notice` at `/email/verify`.

**Side-effect discipline.** The password form was submitted with a deliberately wrong `current_password` so the request could be observed without changing the real credential; `Hash::check('password', ...)` confirmed afterwards that it is intact. Reaching `/email/verify` required an unverified operator, so `email_verified_at` was nulled and then restored to its exact original value `2026-07-31 21:16:48`; mail driver is `log`, so nothing was actually sent. No other data touched.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Five dead submit buttons across auth and settings now submit. Base UI's `useButton` hardcodes `type: 'button'` for native buttons (`useButton.js:167`) where Radix did not, so plain `<Button>` elements inside `<Form>` silently stopped submitting during the Radix -> Base UI migration; because `otherExternalProps` merges last in that same call, an explicit `type="submit"` at the call site is the fix.

Fixed in `settings/profile.tsx`, `settings/security.tsx`, `auth/confirm-password.tsx`, `auth/forgot-password.tsx`, and `auth/verify-email.tsx`. This restores saving your profile, changing your password, confirming your password (which gates `/settings/security` behind `RequirePassword` and was therefore completely unreachable), requesting a password reset, and resending a verification email.

`components/ui/button.tsx` was deliberately left alone: it backs many non-form buttons, and defaulting it to submit would turn every one of them into a submitter. Base UI's default is right for a general-purpose button; intent belongs at the call site.

Every form was exercised in a browser with a request listener attached and observed issuing its POST and rendering its success or validation response. `pnpm fmt:check`, `lint:check`, `types:check` clean; `composer test` still green at 129 tests / 599 assertions.
<!-- SECTION:FINAL_SUMMARY:END -->
