import { d as defineEventHandler, r as readBody, u as useRuntimeConfig } from './nitro/netlify.mjs';
import { u as useDb, v as viewCounts } from './schema.mjs';
import { eq } from 'drizzle-orm';
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

const view = defineEventHandler(async (event) => {
  const { slug } = await readBody(event);
  const config = useRuntimeConfig();
  const db = useDb(config.app.databaseUrl);
  const currentViewCount = await db.select({
    viewCount: viewCounts.viewCount
  }).from(viewCounts).where(eq(viewCounts.slug, slug)).limit(1);
  if (currentViewCount && currentViewCount.length > 0) {
    const viewCount = currentViewCount[0].viewCount;
    await db.update(viewCounts).set({ viewCount: viewCount + 1 }).where(eq(viewCounts.slug, slug));
  } else {
    await db.insert(viewCounts).values({
      slug,
      viewCount: 1
    });
  }
});

export { view as default };
//# sourceMappingURL=view.mjs.map
