import { defineStore } from 'pinia';
import type { MergedPostContent, PostContent, PostPreview } from '~/types/content';

export const usePostStore = defineStore('posts', () => {
  const posts = ref<MergedPostContent[]>([]);
  const latestsPosts = computed(() => posts.value.slice(0, 3));
  const postPreviews = computed((): PostPreview[] => posts.value.map(p => ({
    title: p.title,
    description: p.description,
    category: p.category,
    pubDate: p.pubDate,
    views: p.views,
    _path: p._path,
  } satisfies PostPreview)));

  async function fetchPosts() {
    const [{ data: views }, { data: blogPosts }] = await Promise.all([
      useFetch('/api/views'),
      useAsyncData('content', () =>
        queryContent<PostContent>()
          .only(['body', '_path', 'category', 'description', 'pubDate', 'title', 'heroImage'])
          .find()),
    ]);

    const orderedPosts: MergedPostContent[] = blogPosts?.value
      ? blogPosts.value
        .sort(
          (a, b) =>
            new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
        )
        .map(
          p =>
              ({
                ...p,
                views: views.value?.posts.find(vp => p._path?.includes(vp.slug))?.views ?? 0,
              }) satisfies MergedPostContent,
        )
      : [];

    posts.value = orderedPosts;
  }

  return { fetchPosts, posts, latestsPosts, postPreviews };
});
