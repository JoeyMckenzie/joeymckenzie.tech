<script setup lang="ts">
import type { ParsedPostContent } from '~/types/content';

const { data: contentData } = await useAsyncData('preview-content', () =>
  queryContent<ParsedPostContent>()
    .only(['_path', 'title', 'description', 'category', 'pubDate'])
    .find());

// const { data: postData } = await useFetch('/api/views');

// const mergedData = computed(() => contentData.value?.map(cd => ({
//   ...cd,
//   views: postData.value?.posts.find(p => cd._path.includes(p.slug))?.views ?? 0,
// }) satisfies MergedPostContent));
</script>

<template>
  <main>
    <PageHeader
      title="Blog."
      blerb="I'm a software developer based in Northern California. I enjoy writing about software,
          design, dad jokes, and cheap beer among a few other things. I like building fast, efficient web services,
          learning new things, and writing code in the open source ecosystem."
    />
    <BlogPostPreviews v-if="contentData" :posts="contentData" />
  </main>
</template>
