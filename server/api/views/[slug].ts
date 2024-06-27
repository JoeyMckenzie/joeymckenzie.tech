import { eq } from 'drizzle-orm';
import { posts } from '~/server/utils/schema';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? '';
  const db = useDb();

  const currentViewCount = await db
    .select({
      viewCount: posts.views,
    })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (currentViewCount && currentViewCount.length > 0) {
    const views = currentViewCount[0].viewCount;
    await db
      .update(posts)
      .set({ views: views + 1 })
      .where(eq(posts.slug, slug));
  }
  else {
    await db.insert(posts).values({
      slug,
      views: 1,
    });
  }

  const views = await db
    .select({
      slug: posts.slug,
      views: posts.views,
    })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  return {
    views: views[0].views,
  };
});
