<script setup lang="ts">
import { usePostStore } from '~/utils/store';

const props = defineProps({
  includeLatest: {
    type: Boolean,
    default: false,
  },
});

const { posts, latestsPosts, fetchPosts } = usePostStore();

if (posts.length === 0) {
  await fetchPosts();
}

const previewPosts = props.includeLatest ? latestsPosts : posts;
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
