import { d as defineEventHandler, g as getQuery, u as useRuntimeConfig } from './nitro/netlify.mjs';
import { u as useDb, v as viewCounts } from './schema.mjs';
import { desc } from 'drizzle-orm';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'shikiji';
import 'unified';
import 'mdast-util-to-string';
import 'micromark';
import 'unist-util-stringify-position';
import 'micromark-util-character';
import 'micromark-util-chunked';
import 'micromark-util-resolve-all';
import 'micromark-util-sanitize-uri';
import 'slugify';
import 'remark-parse';
import 'remark-rehype';
import 'remark-mdc';
import 'hast-util-to-string';
import 'github-slugger';
import 'detab';
import 'remark-emoji';
import 'remark-gfm';
import 'rehype-external-links';
import 'rehype-sort-attribute-values';
import 'rehype-sort-attributes';
import 'rehype-raw';
import 'unist-util-visit';
import 'feed';
import 'node:url';
import 'ipx';
import '@neondatabase/serverless';
import 'drizzle-orm/neon-http';
import 'drizzle-orm/pg-core';

const index = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();
  const db = useDb(config.app.databaseUrl);
  let viewCountsQuery = db.select({
    slug: viewCounts.slug,
    count: viewCounts.viewCount
  }).from(viewCounts).orderBy(desc(viewCounts.viewCount));
  if (query.includeTop) {
    viewCountsQuery = viewCountsQuery.limit(3);
  }
  return {
    viewCounts: await viewCountsQuery
  };
});

export { index as default };
//# sourceMappingURL=index.mjs.map
