/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VERCEL_GIT_COMMIT_SHA: string;
  readonly SHUTTLE_SPOTIFY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
