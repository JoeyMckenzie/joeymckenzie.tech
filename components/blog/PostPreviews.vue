<script setup lang="ts">
import type { MergedPostContent } from '~/types/content';

const props = defineProps<{
  posts: MergedPostContent[];
}>();

const sortedPosts = computed(() => [...props.posts].sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf()));
</script>

<template>
  <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
    <BlogPostPreview v-for="post in sortedPosts" :key="post.title" :post-preview="post" />
  </div>
</template>
