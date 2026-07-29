# Post images live on Cloudflare R2, normalized to WebP

Post images are stored on a Cloudflare R2 bucket attached as a Laravel Cloud resource (via the `s3` filesystem driver + `flysystem-aws-s3-v3`), not committed to the repo. Laravel Cloud provides the credentials and a stable public base URL.

Both the one-time import of the 32 legacy posts' 63 images and future admin uploads run through the Laravel 13 `Image` (Intervention) pipeline: cap width at 1600px, `optimize()` to WebP (~q70), store publicly under `posts/{slug}/…`. This gives one uniform format regardless of authoring path, at the cost of requiring GD/Imagick in every runtime and a one-time re-encode of legacy images.

How references are persisted differs by role: **managed records get keys, prose gets URLs.**
- The cover image (`posts.image`) stores the R2 **object key**, resolved to a URL via `Storage::disk(...)->url()`, because covers are replaced/deleted/re-processed from the admin and those operations need the key.
- **Inline** body images store the **absolute public URL** baked into the markdown `content` (and `content_html`), because they're embedded in free text and the browser needs an absolute src.

If the public base URL ever changes: cover images are a config swap (no data change); inline URLs are fixed by `posts:rerender` plus a one-off content find/replace. No responsive `srcset`/multi-size — single optimized WebP per image, revisit only if needed.
