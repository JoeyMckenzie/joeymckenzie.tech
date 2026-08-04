---
id: JOEY-18.1
title: Improve blog review diagnostics and timeout handling
status: Done
assignee:
  - Pi
created_date: '2026-08-04 16:35'
updated_date: '2026-08-04 17:04'
labels:
  - bug
  - ai
  - logging
  - blog
dependencies: []
references:
  - .backlog/tasks/joey-18 - Add-in-app-blog-post-review-agent.md
documentation:
  - 'https://laravel.com/docs/13.x/ai-sdk#middleware'
  - 'https://laravel.com/docs/13.x/ai-sdk#events'
  - 'https://laravel.com/docs/13.x/http-client#throwing-exceptions'
modified_files:
  - .env.example
  - devenv.nix
  - config/ai.php
  - app/Ai/Agents/BlogPostReviewer.php
  - app/Ai/Middleware/LogBlogPostReview.php
  - app/Exceptions/PostReviewRuntimeTimeoutMismatch.php
  - app/Services/PostReviewService.php
  - app/Http/Controllers/Admin/PostReviewController.php
  - tests/Feature/Admin/PostReviewTest.php
parent_task_id: JOEY-18
priority: high
ordinal: 33000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The live Anthropic review endpoint can fail on longer posts without enough diagnostic context to distinguish provider HTTP failures, connection timeouts, schema retries, and persistence failures. A 19,646-character post reproduced a 60-second connection timeout while a minimal prompt and a later 120-second probe succeeded. Improve the review pipeline's operational visibility and timeout defaults without logging post content, model output, credentials, or response bodies. Keep user-facing errors generic and preserve the existing save-first and prior-review retention behavior.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The blog review timeout default accommodates the observed long-post latency while remaining configurable through the existing environment variable.
- [x] #2 Review lifecycle logs identify provider, model, configured timeout, prompt size, attempt number, duration, response note count, and failure class where applicable.
- [x] #3 Provider HTTP failures include safe diagnostics such as status code and provider request identifier, while connection timeouts are distinguishable from HTTP and schema failures.
- [x] #4 Logs never include API credentials, authorization headers, post markdown, generated notes, model response bodies, or exception messages that may contain sensitive payloads.
- [x] #5 Agent-level middleware records prompt start and successful completion using the Laravel AI SDK middleware contract.
- [x] #6 Schema-invalid retries are logged without duplicating provider-failure logs or changing retry behavior.
- [x] #7 The controller keeps generic client errors and prior-review retention behavior unchanged.
- [x] #8 Automated tests use Laravel AI fakes and logging assertions to cover successful lifecycle logging, invalid-output retry logging, and provider/connection failure diagnostics.
- [x] #9 Focused tests and project formatting, linting, refactor, and type checks pass.
- [x] #10 The Devenv PHP application process has a finite execution limit longer than the configured 120-second AI timeout, so long reviews are not terminated by PHP first.
- [x] #11 Review logs include the effective PHP execution limit, and a finite PHP limit that cannot accommodate the provider timeout produces a safe `runtime_timeout_mismatch` failure log before prompting the provider.
- [x] #12 Regression coverage proves runtime-timeout mismatches are logged and returned through the existing generic 503 path without prompting the provider.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Raise the configurable blog-review AI timeout default to 120 seconds in `config/ai.php` and `.env.example`, preserving `BLOG_REVIEW_AI_TIMEOUT` overrides.
2. Generate and implement dedicated Laravel AI middleware for `BlogPostReviewer` that logs safe invocation start/completion metadata: provider, model, timeout, prompt character count, duration, invocation ID, and token usage. Never log prompt/model output, credentials, headers, response bodies, or exception messages.
3. Instrument `PostReviewService` around each schema-validation attempt. Log workflow start, malformed-response retry, success, and classified failure metadata. For `RequestException`, include only status and a safe provider request ID; distinguish `ConnectionException`, provider HTTP errors, invalid structured output, and other exceptions. Rethrow failures unchanged.
4. Keep `PostReviewController` user-facing responses and prior-review retention behavior unchanged while eliminating redundant generic provider-failure logging; retain boundary logging for persistence failures as appropriate.
5. Add PHPUnit coverage using Laravel AI fakes and logging assertions for middleware lifecycle logs, malformed-output retries, successful service completion, connection failures, and safe HTTP diagnostics.
6. Run focused tests, Pint, Rector, PHPStan, Composer formatting/lint checks, and relevant project quality checks; update acceptance criteria and task notes as evidence is produced.

## Approved runtime-deadline correction

7. Configure the Devenv `app` process to launch the PHP development server with a 180-second `max_execution_time`, exceeding the 120-second provider timeout and preserving a shutdown buffer.
8. Read the effective PHP execution limit in `PostReviewService`, include it in structured lifecycle context, and fail fast with a classified `runtime_timeout_mismatch` warning when a non-zero runtime deadline is less than or equal to the configured provider timeout. Keep prompts, responses, credentials, and exception messages excluded.
9. Add fake-backed regression coverage proving the mismatch returns the existing generic 503, emits actionable safe context, and never prompts the provider. Restart Devenv's app process and verify its configured deadline before rerunning focused and full quality checks.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Root cause reproduced against post 31: the 19,646-character body hit an `Illuminate\Http\Client\ConnectionException` after 60,002 ms with zero bytes received. The same body succeeded with a 120-second timeout in 53,657 ms. A short prompt also succeeded, ruling out invalid credentials/model configuration.

Implemented a 120-second configurable default, dedicated `BlogPostReviewer` middleware lifecycle logs, service attempt/retry/success/failure logs, safe HTTP status/request-ID extraction, and explicit connection/provider/schema/unexpected failure classification. Controller client responses and persistence behavior remain unchanged; duplicate provider failure logging was removed.

Focused validation passed after implementation: `PostReviewTest` has 14 passing tests / 127 assertions. Pint and PHPStan pass. Tests verify safe lifecycle metadata, schema retry logs, timeout classification, safe provider HTTP diagnostics, and that prompt/output/exception-body sentinel values never enter logs.

Final validation passed: effective `ai.blog_review.timeout` is 120; focused PostReviewTest is 14 tests / 127 assertions; full `composer ci:check` is 166 tests / 866 assertions; Pint, Rector, PHPStan, ESLint, Prettier, TypeScript, Composer validation, LSP/lens diagnostics, and `git diff --check` all pass. No new live provider request was made after implementation because the pre-implementation 120-second diagnostic already succeeded.

Post-completion live reproduction exposed an infrastructure-level failure path not visible to Laravel: Devenv process logs show `Fatal error: Maximum execution time of 30+2 seconds exceeded (terminated)` in Guzzle's CurlHandler, followed by application process restarts. The two corresponding Laravel log sequences stop after `Blog post reviewer prompted` because PHP terminates the process before application catch/finally handlers can run. User approved reopening this task to align the PHP runtime deadline and add a preflight observability guard.

Runtime correction implemented. `devenv.nix` now builds PHP with `max_execution_time = 180`; the processes were fully stopped/rebuilt/restarted. The app process is ready with restart count 0, and an isolated request through the exact PHP binary under the `cli-server` SAPI reported `max_execution_time: 180` and `hard_timeout: 2`.

`PostReviewService` now logs `php_max_execution_time_seconds` on every review and fails before any provider prompt when a finite PHP deadline is less than or equal to the configured AI timeout. The failure is classified as `runtime_timeout_mismatch`, includes attempt 0 and the safe runtime/provider limits, and still returns the existing generic 503 through the controller.

Regression validation currently passes: 15 focused tests / 143 assertions, including a runtime mismatch test that verifies no provider prompt occurs. Pint, PHPStan, Rector, Nix syntax, LSP/lens diagnostics, and diff checks pass.

Final correction validation passed: full `composer ci:check` reports 167 tests / 882 assertions; app process remains ready with restart count 0; Pint, Rector, PHPStan, ESLint, Prettier, TypeScript, Nix syntax, LSP/lens diagnostics, and diff checks pass. No staged files, and unrelated JOEY-19 remains untouched.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Summary

Diagnosed two independent timeout layers behind the live Anthropic review failures and made both observable. The provider request initially exceeded the application's 60-second HTTP timeout, and later the Devenv PHP server terminated requests at 30 seconds before Laravel could execute any catch or logging path. The AI timeout is now 120 seconds, the development PHP server permits 180 seconds, and the service fails fast with actionable logs when those limits are misaligned.

## Changes

- Raised the configurable blog-review AI timeout default from 60 to 120 seconds.
- Configured Devenv PHP with a 180-second `max_execution_time`; rebuilt and restarted all processes.
- Added Laravel AI middleware lifecycle logs with provider, model, timeout, prompt size, duration, invocation identifiers, and token usage.
- Added service logs for workflow/attempt starts, invalid-output retries, completion, and classified failures.
- Added `php_max_execution_time_seconds` to review logs.
- Added a preflight runtime guard that emits `runtime_timeout_mismatch` and returns the existing generic 503 before prompting Anthropic when a finite PHP deadline cannot accommodate the AI timeout.
- Classified connection, provider HTTP, invalid response, runtime mismatch, and unexpected failures.
- Included only safe provider HTTP status and validated request identifiers; prompts, generated notes, response bodies, credentials, headers, and exception messages remain excluded.
- Removed duplicate controller provider-failure logging without changing persistence, save-first behavior, or retained reviews.

## Validation

- Focused `PostReviewTest`: 15 tests / 143 assertions.
- Full `composer ci:check`: 167 tests / 882 assertions.
- Added fake-backed regression coverage proving runtime mismatches do not prompt the provider and produce safe actionable logs through the generic 503 path.
- The exact Devenv PHP binary reported `max_execution_time: 180` under the `cli-server` SAPI.
- Devenv app process is ready with restart count 0.
- Pint, Rector, PHPStan, ESLint, Prettier, TypeScript, Nix syntax, LSP/lens diagnostics, and diff checks pass.

## Operational note

An external reverse proxy can still terminate a request outside Laravel's control. If another attempt ends after only start/prompt logs, inspect the process/proxy logs and compare their deadline against the logged provider and PHP limits.
<!-- SECTION:FINAL_SUMMARY:END -->
