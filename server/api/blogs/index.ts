import { desc } from 'drizzle-orm';
import { viewCounts } from '~/server/utils/schema';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();
  const db = useDb(config.app.databaseUrl);

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
