import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

export function createDrizzleClient(authToken: string, url: string) {
  const client = createClient({ url, authToken });
  const db = drizzle(client);

  return db;
}

export type DrizzleClient = ReturnType<typeof createDrizzleClient>;
