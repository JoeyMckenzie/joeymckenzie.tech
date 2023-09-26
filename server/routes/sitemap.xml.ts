import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // I'm not willing to disable sorting imports on save and this needs to be
  // imported prior to sitemap... so manually importing will do for now
  const { serverQueryContent } = await import('#content/server');
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
