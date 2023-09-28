import { SitemapStream, streamToPromise } from 'sitemap';
import { serverQueryContent } from '#content/server';

export default defineEventHandler(async (event) => {
  // Auto sort imports moves this to the top, sitemap nneds to import first apparently
  const docs = await serverQueryContent(event).find();
  const sitemap = new SitemapStream({
    hostname: 'https://joeymckenzie.tech',
  });

  for (const doc of docs) {
    sitemap.write({
      url: doc._path,
      changefreq: 'monthly',
    });
  }

  sitemap.end();

  return streamToPromise(sitemap);
});
