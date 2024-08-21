import { desc } from 'drizzle-orm';
import { posts } from '~~/database/schema';

export default defineEventHandler(async () => {
  const db = useDb();

  const views = await db
    .select({
      slug: posts.slug,
      views: posts.views,
    })
    .from(posts)
    .orderBy(desc(posts.views))
    .limit(3);

  return {
    posts: views,
  };
});
