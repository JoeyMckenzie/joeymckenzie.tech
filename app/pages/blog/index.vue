<script setup lang="ts">
import { usePostStore } from '~/stores/posts';

const { postPreviews } = usePostStore();
</script>

<template>
  <main>
    <PageHeader
      title="Blog."
      blerb="I write about a lot of things, mainly languages, ecosystems, and software design. I consider my writing a
      journal of technologies I've worked with at some point during my career, and I'm always happy to field questions
      and conversations from interested readers."
    />
    <BlogPostPreviews :posts="postPreviews" />
  </main>
</template>
