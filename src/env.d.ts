/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly SPOTIFY_REFRESH_TOKEN: string;
	readonly SPOTIFY_CLIENT_ID: string;
	readonly SPOTIFY_CLIENT_SECRET: string;
	readonly VERCEL_GIT_COMMIT_SHA: string;
	readonly QUOTES_BASE_URL: string;
	readonly VITE_DATABASE_URL: string;
	readonly VITE_TURSO_AUTH_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
