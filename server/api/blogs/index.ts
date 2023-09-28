import { desc } from 'drizzle-orm';
import { viewCounts } from '~/server/utils/schema';
import db from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  let viewCountsQuery = db
    .select({
      slug: viewCounts.slug,
      count: viewCounts.viewCount,
    })
    .from(viewCounts)
    .orderBy(desc(viewCounts.viewCount));

  if (query.includeTop) {
    viewCountsQuery = viewCountsQuery.limit(3);
  }

  return {
    viewCounts: await viewCountsQuery,
  };
});
