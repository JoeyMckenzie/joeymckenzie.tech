import type { Config } from 'drizzle-kit';

export default {
  schema: './server/drizzle/schema.ts',
  out: './server/drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: import.meta.env.DATABASE_URL ?? '',
  },
} satisfies Config;
