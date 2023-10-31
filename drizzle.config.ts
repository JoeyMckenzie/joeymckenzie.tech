import type { Config } from 'drizzle-kit';

export default {
  schema: './server/utils/schema.ts',
  out: './server/drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: import.meta.env.VERCEL_GIT_COMMIT_SHA ?? '',
  },
} satisfies Config;
