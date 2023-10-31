import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export function useDb(connectionString: string) {
  neonConfig.fetchConnectionCache = true;

  const sql = neon(connectionString);
  const db = drizzle(sql, { logger: true });

  return db;
}
