import { eq } from 'drizzle-orm';
import { posts } from '~~/database/schema';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? '';
  const db = useDb();

  const existingPost = await db.select({
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
  if (!post) {
    sendRedirect(event, '/blog', 301);
    return;
  }

  return {
    post,
  };
});
