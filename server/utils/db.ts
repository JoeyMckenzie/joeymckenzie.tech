import { createDrizzleClient } from '~~/database/client';
import { posts } from '~~/database/schema';

export function useDb() {
  const { tursoAuthToken: authToken, tursoDatabaseUrl: url } = useRuntimeConfig();
  return createDrizzleClient(authToken, url);
}

export async function getPostPreviews(limit?: number) {
  const db = useDb();

  if (limit && limit > 0) {
    return await db.select({
      slug: posts.slug,
      title: posts.title,
      pubDate: posts.publishedDate,
      category: posts.category,
      views: posts.views,
    }).from(posts)
      .limit(limit);
  }

  return await db.select({
    slug: posts.slug,
    title: posts.title,
    pubDate: posts.publishedDate,
    category: posts.category,
    views: posts.views,
  }).from(posts);
}
