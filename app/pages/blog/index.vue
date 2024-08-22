<script setup lang="ts">
import type { PostPreview } from '~~/types/content';

const { data } = await useFetch<{ posts: PostPreview[] }>('/api/blog', {
  cache: 'force-cache',
  headers: {
    'Cache-Control': 'max-age=3600',
  },
});
</script>

<template>
  <main>
    <PageHeader
      title="Blog."
      blerb="I write about a lot of things, mainly languages, ecosystems, and software design. I consider my writing a
      journal of technologies I've worked with at some point during my career, and I'm always happy to field questions
      and conversations from interested readers."
    />
    <BlogPostPreviews v-if="data?.posts" :posts="data.posts" />
  </main>
</template>
