import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  slug: text('slug').notNull(),
  views: integer('views').notNull().default(0),
});
