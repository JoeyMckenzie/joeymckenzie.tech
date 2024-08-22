import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts_tmp', {
  id: integer('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  views: integer('views').notNull().default(0),
  title: text('title').notNull(),
  description: text('description').notNull(),
  publishedDate: text('published_date').notNull(),
  heroImage: text('heroImage').notNull(),
  category: text('category').notNull(),
  rawContent: text('raw_content').notNull(),
  parsedContent: text('parsed_content').notNull(),
});

export const keywords = sqliteTable('keywords_tmp', {
  id: integer('id').primaryKey(),
  word: text('word').notNull().unique(),
});

export const keywordPost = sqliteTable('keyword_post_tmp', {
  id: integer('id').primaryKey(),
  postId: integer('post_id').notNull(),
  keywordId: integer('keyword_id').notNull(),
});
