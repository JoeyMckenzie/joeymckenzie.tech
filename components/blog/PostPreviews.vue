<script setup lang="ts">
import type { PostPreview } from '~/types/content';

const props = defineProps<{
  posts: PostPreview[];
}>();

const sortedPosts = computed(() => [...props.posts].sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf()));
</script>

<template>
  <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
    <BlogPostPreview v-for="post in sortedPosts" :key="post.title" :post-preview="post" />
  </div>
</template>
