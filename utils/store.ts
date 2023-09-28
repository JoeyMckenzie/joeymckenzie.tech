import { defineStore } from 'pinia';
import { BlogPostProps } from '~/components/blog/PostPreview.vue';

export const usePostStore = defineStore('counter', () => {
  const posts = ref<BlogPostProps[]>([]);
  const latestsPosts = computed(() => posts.value.slice(0, 3));

  async function fetchPosts() {
    const [{ data: viewCounts }, { data: blogPosts }] = await Promise.all([
      useFetch('/api/blogs'),
      useAsyncData('blogs', () =>
        queryContent('blog')
          .only(['_path', 'category', 'description', 'pubDate', 'title'])
          .find(),
      ),
    ]);

    const orderedPosts = blogPosts?.value
      ? blogPosts.value
          .sort(
            (a, b) =>
              new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
          )
          .map(
            (p) =>
              ({
                slug: p._path!,
                category: p.category,
                description: p.description,
                pubDate: new Date(p.pubDate),
                title: p.title!,
                viewCount:
                  viewCounts.value?.viewCounts?.find(
                    (vc) => p._path?.includes(vc.slug),
                  )?.count ?? 0,
              }) satisfies BlogPostProps,
          )
      : [];

    posts.value = orderedPosts;
  }

  return { fetchPosts, posts, latestsPosts };
});
