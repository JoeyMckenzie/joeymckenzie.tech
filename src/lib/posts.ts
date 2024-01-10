import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";

export function loadPostPreviews(includeLatest = false) {
  let posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.pubDate), new Date(b.pubDate)),
  );

  if (includeLatest) {
    posts = posts.slice(0, 3);
  }

  return posts;
}

export async function loadPost(slug: string) {
  const post = allPosts.find((p) => p.url.includes(slug));

  if (!post) {
    return;
  }

  return post;
}
