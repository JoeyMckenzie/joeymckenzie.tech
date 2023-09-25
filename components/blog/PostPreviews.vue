<script setup lang="ts">
import { BlogPostProps } from './PostPreview.vue';

const props = defineProps({
  includeLatest: {
    type: Boolean,
    default: false,
  },
});

const [{ data: viewCounts }, { data: posts }] = await Promise.all([
  useFetch('/api/blogs'),
  useAsyncData('blogs', () =>
    queryContent('blog')
      .only(['_path', 'category', 'description', 'pubDate', 'title'])
      .find(),
  ),
]);

let previewPosts = posts?.value
  ? posts.value
      .sort(
        (a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
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

if (props.includeLatest) {
  previewPosts = previewPosts.slice(0, 3);
}
</script>

<template>
  <div class="mx-auto">
    <div
      class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-neutral-800 pt-10 sm:mt-16 sm:grid-cols-2 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
    >
      <BlogPostPreview
        v-for="post in previewPosts"
        :key="post.slug"
        :slug="post.slug"
        :pub-date="post.pubDate"
        :category="post.category"
        :description="post.description"
        :title="post.title"
        :view-count="post.viewCount"
      />
    </div>
  </div>
</template>
