import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import { getViewCount, getViewCounts } from "./db";
import { PostWithBodyViewCount, PostWithViewCount } from "./types";

export async function loadPostPreviews(includeLatest = false) {
  const viewCounts = await getViewCounts();

  let posts = allPosts
    .map(
      (p) =>
        ({
          viewCount:
            viewCounts.find((vc) => p._id.includes(vc.slug))?.count ?? 0,
          ...p,
        }) satisfies PostWithViewCount,
    )
    .sort((a, b) => compareDesc(new Date(a.pubDate), new Date(b.pubDate)));

  if (includeLatest) {
    posts = posts.slice(0, 3);
  }

  return posts;
}

export async function loadPost(slug: string) {
  const viewCount = await getViewCount(slug);
  const post = allPosts.find((p) => p.url.includes(slug));

  if (!post) {
    return;
  }

  return {
    viewCount: viewCount[0]?.count ?? 0,
    ...post,
  } satisfies PostWithBodyViewCount;
}
