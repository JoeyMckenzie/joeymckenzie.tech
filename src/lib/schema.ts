import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const viewCounts = pgTable('view_counts', {
  id: serial('id').primaryKey().notNull(),
  slug: text('slug').notNull(),
  viewCount: integer('view_count').default(0).notNull(),
});
