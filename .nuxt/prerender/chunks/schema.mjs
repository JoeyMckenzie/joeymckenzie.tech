import { neonConfig, neon } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/@neondatabase/serverless/index.mjs';
import { drizzle } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/drizzle-orm/neon-http/index.mjs';
import { pgTable, serial, text, integer } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/drizzle-orm/pg-core/index.mjs';

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
