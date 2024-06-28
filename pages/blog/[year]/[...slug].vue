<script setup lang="ts">
const route = useRoute();
const { posts } = usePostStore();

const slug = computed(() => route.params.slug as string);
const post = computed(() => posts.find(p => p._path?.includes(slug.value)));

if (!post.value) {
  await navigateTo({ path: '/blog' });
}

const { data } = await useFetch<{ views: number }>(`/api/views/${slug.value}`);
</script>

<template>
  <main class="mx-auto py-12">
    <article class="prose dark:prose-invert mx-auto">
      <h1 class="text-2xl sm:text-center">
        {{ post!.title }}
      </h1>
      <div class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tighter">
        <FormattedDate :date="post!.pubDate" />
        <UBadge :label="post!.category" />
        <FormattedViews v-if="data" :views="data.views" />
      </div>
      <NuxtImg
        :src="post!.heroImage" :alt="`${post!.title} blog meme image`"
        class="mx-auto rounded-md"
      />
      <ContentRenderer class="text-sm leading-6 dark:text-neutral-400" :value="post" />
    </article>
    <div class="flex justify-center pt-8">
      <UButton to="/blog">
        Back to blog
      </UButton>
    </div>
  </main>
</template>
