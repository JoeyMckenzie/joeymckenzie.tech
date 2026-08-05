---
id: JOEY-20
title: 'Open Graph, Twitter Card, and canonical SEO metadata for public pages'
status: Done
assignee: []
created_date: '2026-08-05 20:31'
updated_date: '2026-08-05 20:46'
labels:
  - seo
  - blog
  - frontend
dependencies: []
modified_files:
  - app/Http/Middleware/HandleInertiaRequests.php
  - config/inertia.php
  - resources/js/components/seo.tsx
  - resources/js/types/global.d.ts
  - resources/js/pages/blog/show.tsx
  - resources/js/pages/blog/index.tsx
  - resources/js/pages/home.tsx
  - resources/js/pages/now.tsx
  - resources/js/pages/uses.tsx
  - resources/js/pages/cv.tsx
  - tests/Feature/Blog/BlogShowTest.php
  - tests/Feature/Home/HomePageTest.php
priority: high
ordinal: 36000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Sharing a blog post URL on Reddit (and other platforms like Slack/Discord/X) renders no preview card because the site emits zero Open Graph or Twitter Card tags. The blog show page only renders a title and meta description. Inertia SSR is already enabled, so tags added via Inertia's Head component are server-rendered and visible to non-JS crawlers.\n\nAdd full social/SEO metadata to blog post pages (og:title/description/image/url/type=article, article:published_time/tag, Twitter Card, canonical URL), with the absolute post URL and cover image supplied by the controller. Posts without a cover image need a sensible fallback image. Roll the same pattern out via a shared head component to the other public pages (home, blog index, now, uses, cv) with site-wide defaults.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Blog post pages emit og:title, og:description, og:image, og:url, og:type=article, article:published_time, and article:tag meta tags with absolute URLs
- [x] #2 Blog post pages emit twitter:card (summary_large_image when a cover exists), twitter:title, twitter:description, and twitter:image tags
- [x] #3 Blog post pages emit a canonical link pointing to the post's absolute URL without query strings
- [x] #4 Posts without a cover image fall back to a default site image rather than omitting og:image
- [x] #5 Other public pages (home, blog index, now, uses, cv) emit og/twitter/canonical tags via a shared component with site-wide defaults
- [x] #6 Feature tests assert the SEO props are passed for blog show and at least one other public page
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Share a `seo` prop site-wide from HandleInertiaRequests: canonical URL (`$request->url()`, absolute and query-string-free), site name, and a default social image (`asset('android-chrome-512x512.png')`).
2. Add a shared `Seo` head component (`resources/js/components/seo.tsx`) that composes the description, canonical link, Open Graph tags (title/description/image/url/type/site_name), Twitter Card tags (summary_large_image when a real cover exists, summary otherwise), and article tags (published_time, tag) from the shared prop plus per-page props.
3. Replace the bare `<Head>` blocks on blog/show, blog/index, home, now, uses, and cv with `<Seo>`. Blog show passes cover/type=article/publishedTime/tag from the existing controller props — no controller changes needed since `seo.url` already resolves to the post URL on that route and cover URLs from R2 are absolute.
4. Type the new shared prop in `resources/js/types/global.d.ts` (Inertia v3 `InertiaConfig.sharedPageProps`).
5. Tests: BlogShowTest asserts the shared seo props, post SEO fields, and that the canonical URL strips query strings (`?utm_source=reddit`); HomePageTest asserts the shared seo defaults.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
No controller changes were needed: the canonical/og:url comes from the shared middleware prop ($request->url() on the blog.show route IS the post URL), and coverUrl() already returns absolute URLs (R2_URL-backed disk or passthrough of absolute URLs).

The default og:image fallback is the existing android-chrome-512x512.png favicon asset — passable but square. A branded 1200x630 social card image would be a nice follow-up; the twitter:card tag already downgrades to 'summary' when the fallback is used so it renders sanely.

Meta tags reach non-JS crawlers (Reddit/Slack/Discord) only via Inertia SSR, which is enabled (config/inertia.php) with a build:ssr script — worth verifying the SSR process is actually running in production after deploy.

Pre-existing failures encountered (not addressed here): composer lint fails with 62 phpstan errors in app/Ai/* (Laravel\Ai symbols not found, from JOEY-18 work), and pnpm types:check failed on use-post-review.ts until Wayfinder was regenerated with --with-form.

Browser verification (ego lite) surfaced a local-stack SSR bug: dev-mode SSR dispatch goes to the Vite hot-file URL (https://assets.joeymckenzie.tech.test via the devenv HTTPS proxy), whose local CA PHP's curl doesn't trust — cURL error 60 — so Inertia silently fell back to CSR and crawlers saw zero head tags locally. Fixed by setting inertia.ssr.hot_url to http://127.0.0.1:5173 (plain HTTP straight to Vite), overridable via INERTIA_SSR_HOT_URL. Production is unaffected (uses the built bundle + inertia:start-ssr on 127.0.0.1:13714).

Verified in-browser on /blog/local-laravel-with-nix: raw no-JS HTML (crawler view) now contains data-server-rendered=true and all 15 head tags — description, canonical, og:title/description/image/url/type=article/site_name, twitter:card=summary_large_image + title/description/image, article:published_time, article:tag, and the SSR title.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## What changed

Sharing any page of the site (notably blog posts on Reddit) produced no preview card because the app emitted zero Open Graph/Twitter Card tags. This adds full social/SEO metadata to all public pages.

- **`HandleInertiaRequests`** now shares a `seo` prop on every response: canonical URL (absolute, query-string-free via `$request->url()`), site name, and default social image (`android-chrome-512x512.png`).
- **New shared `Seo` component** (`resources/js/components/seo.tsx`) renders: meta description, `<link rel="canonical">`, `og:title/description/image/url/type/site_name`, `twitter:card/title/description/image`, and for articles `article:published_time` + `article:tag`. Twitter card is `summary_large_image` only when a real cover exists, `summary` for the square fallback icon.
- **Pages updated** to use it: `blog/show` (type=article with cover, published date, tag from existing controller props), `blog/index` (gained a meta description it previously lacked), `home`, `now`, `uses`, `cv`.
- **Typed** the shared prop in `global.d.ts` (Inertia v3 `sharedPageProps`).

Tags are server-rendered via the already-enabled Inertia SSR, which is what makes them visible to non-JS scrapers.

## Tests

- `BlogShowTest`: new tests for shared seo props + post SEO fields, and canonical URL stripping query strings (`?utm_source=reddit`).
- `HomePageTest`: new test for shared seo defaults.
- 14 tests / 128 assertions pass; pint, rector, eslint, prettier, tsc all clean.

## Risks / follow-ups

- Default og:image is the square favicon — a branded 1200x630 card would look better (possible follow-up task).
- Verify the SSR process runs in production; without it crawlers see no head tags at all.
- Pre-existing, untouched: phpstan errors in `app/Ai/*` (JOEY-18), and Wayfinder types needed regenerating with `--with-form`.

## Post-completion verification + local SSR fix

In-browser verification (ego lite) on the local stack found dev-mode SSR was silently falling back to client-side rendering: the adapter dispatches to the Vite hot-file URL (the devenv HTTPS asset proxy), whose local CA PHP's curl doesn't trust (cURL error 60). Added `inertia.ssr.hot_url` (default `http://127.0.0.1:5173`, env-overridable via `INERTIA_SSR_HOT_URL`) to `config/inertia.php` so dev SSR talks to Vite over plain HTTP. Production is unaffected. After the fix, the raw no-JS HTML of a real blog post contains all 15 SEO head tags server-rendered.
<!-- SECTION:FINAL_SUMMARY:END -->
