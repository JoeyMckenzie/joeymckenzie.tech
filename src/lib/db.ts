import { createClient } from "@libsql/client";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { viewCounts } from "./schema";

function getSqlClient() {
  const client = createClient({
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.TURSO_AUTH_TOKEN ?? "",
  });
  return drizzle(client);
}

export async function getViewCounts(topOnly = false) {
  const viewCountsQuery = await getSqlClient()
    .select({
      slug: viewCounts.slug,
      count: viewCounts.viewCount,
    })
    .from(viewCounts)
    .orderBy(desc(viewCounts.viewCount));

  return topOnly ? viewCountsQuery.slice(0, 3) : viewCountsQuery;
}

export async function getViewCount(slug: string) {
  const viewCountQuery = await getSqlClient()
    .select({
      count: viewCounts.viewCount,
    })
    .from(viewCounts)
    .where(eq(viewCounts.slug, slug))
    .limit(1);

  return viewCountQuery;
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
