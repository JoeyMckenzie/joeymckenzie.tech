/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VERCEL_GIT_COMMIT_SHA: string;
  readonly API_BASE_URL: string;
  readonly VIEW_COUNT_SHOW_THRESHOLD: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
