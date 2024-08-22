import { createDrizzleClient } from '~~/database/client';
import { posts } from '~~/database/schema';

export function useDb() {
  const { tursoAuthToken: authToken, tursoDatabaseUrl: url } = useRuntimeConfig();
  return createDrizzleClient(authToken, url);
}

export async function getPostPreviews(latest = false) {
  const db = useDb();

  const postPreviews = await db.select({
    slug: posts.slug,
    title: posts.title,
    pubDate: posts.publishedDate,
    category: posts.category,
    views: posts.views,
    description: posts.description,
  }).from(posts);

  if (latest) {
    return postPreviews.sort(
      (a, b) =>
        new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
    ).slice(0, 3);
  }

  return postPreviews;
}
