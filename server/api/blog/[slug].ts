import { eq } from 'drizzle-orm';
import { keywordPost, keywords, posts } from '~~/database/schema';

const botPatterns = [
  '/googlebot/i', // Google's web crawler
  '/bingbot/i', // Microsoft's Bing bot
  '/slurp/i', // Yahoo's search engine bot
  '/duckduckbot/i', // DuckDuckGo's bot
  '/baiduspider/i', // Baidu's bot
  '/yandexbot/i', // Yandex's bot
];

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? '';
  const headers = getHeaders(event);
  const agent = headers['User-Agent'] ?? '';
  const db = useDb();

  const existingPost = await db.select({
    id: posts.id,
    title: posts.title,
    pubDate: posts.publishedDate,
    category: posts.category,
    heroImage: posts.heroImage,
    views: posts.views,
    content: posts.parsedContent,
  })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  const post = existingPost?.[0];

  if (post) {
    // Bot crawling the post most likely, no need to increment view count
    if (agent && botPatterns.some(p => new RegExp(p).test(agent))) {
      return {
        post,
      };
    }

    const keywordsForMeta = await db.select({
      word: keywords.word,
    })
      .from(keywords)
      .innerJoin(keywordPost, eq(keywordPost.keywordId, keywords.id))
      .innerJoin(posts, eq(posts.id, keywordPost.postId))
      .where(eq(posts.slug, slug));

    await db
      .update(posts)
      .set({ views: post.views + 1 })
      .where(eq(posts.slug, slug));

    return {
      post,
      keywords: keywordsForMeta?.map(kw => kw.word) ?? [],
    };
  }

  return {
    post,
  };
});
