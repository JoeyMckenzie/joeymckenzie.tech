import { eq } from 'drizzle-orm';
import db from '~/server/drizzle/db';
import { viewCounts } from '~/server/drizzle/schema';

export default defineEventHandler(async (event) => {
  const { slug } = await readBody<{ slug: string }>(event);

  const currentViewCount = await db
    .select({
      viewCount: viewCounts.viewCount,
    })
    .from(viewCounts)
    .where(eq(viewCounts.slug, slug))
    .limit(1);

  if (currentViewCount && currentViewCount.length > 0) {
    const viewCount = currentViewCount[0].viewCount;
    await db
      .update(viewCounts)
      .set({ viewCount: viewCount + 1 })
      .where(eq(viewCounts.slug, slug));
  }
});
