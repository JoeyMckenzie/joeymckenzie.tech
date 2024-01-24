import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const viewCounts = sqliteTable("view_counts", {
  id: integer("id").primaryKey().notNull(),
  slug: text("slug").notNull(),
  viewCount: integer("view_count").default(0).notNull(),
});

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});
