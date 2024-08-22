<script setup lang="ts">
import type { PostPreview } from '~~/types/content';

const { data } = await useFetch<{ posts: PostPreview[] }>(`/api/blog/latest`);
</script>

<template>
  <main>
    <div>
      <PageHeader
        title="Hey, I'm Joey."
        blerb="I'm a software developer based in Northern California working in fintech. I enjoy writing about software,
            design, dad jokes, and cheap beer among a few other things. I like building fast, efficient web services,
            learning new things, and writing code in the open source ecosystem."
      />
      <SocialLinks />
    </div>
    <div class="pt-12">
      <h2 class="pb-12 text-2xl font-bold tracking-tight">
        Latest thoughts.
      </h2>
      <BlogPostPreviews v-if="data?.posts" :posts="data.posts" />
      <div class="flex justify-center py-6">
        <UButton to="/blog" size="sm" icon="i-heroicons-arrow-right" :trailing="true">
          Blogs
        </UButton>
      </div>
    </div>
  </main>
</template>
