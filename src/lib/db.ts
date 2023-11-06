import { desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { viewCounts } from './schema';
import { DATABASE_URL } from '$env/static/private';

function getSqlClient() {
  const sql = postgres(DATABASE_URL, { ssl: 'require' });
  return drizzle(sql);
}

export type ViewCountQuery = {
  slug: string;
  count: number;
};

export async function getViewCounts(
  topOnly = false,
): Promise<ViewCountQuery[]> {
  let viewCountsQuery = getSqlClient()
    .select({
      slug: viewCounts.slug,
      count: viewCounts.viewCount,
    })
    .from(viewCounts)
    .orderBy(desc(viewCounts.viewCount));

  if (topOnly) {
    viewCountsQuery = viewCountsQuery.limit(3);
  }

  return viewCountsQuery;
}

export async function addViewCount(slug: string) {
  const db = getSqlClient();
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
  } else {
    await db.insert(viewCounts).values({
      slug,
      viewCount: 1,
    });
  }
}
