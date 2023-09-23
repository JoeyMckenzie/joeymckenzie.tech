import { desc } from 'drizzle-orm';
import db from '../../drizzle/db';
import { viewCounts } from '../../drizzle/schema';

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
