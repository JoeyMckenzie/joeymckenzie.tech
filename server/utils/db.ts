import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

export function useDb() {
  const { tursoAuthToken: authToken, tursoDatabaseUrl: url } = useRuntimeConfig();

  const client = createClient({ url, authToken });
  const db = drizzle(client);

  return db;
}
