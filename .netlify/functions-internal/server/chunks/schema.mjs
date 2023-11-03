import { neonConfig, neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

function useDb(connectionString) {
  neonConfig.fetchConnectionCache = true;
  const sql = neon(connectionString);
  const db = drizzle(sql, { logger: true });
  return db;
}

const viewCounts = pgTable("view_counts", {
  id: serial("id").primaryKey().notNull(),
  slug: text("slug").notNull(),
  viewCount: integer("view_count").default(0).notNull()
});

export { useDb as u, viewCounts as v };
//# sourceMappingURL=schema.mjs.map
