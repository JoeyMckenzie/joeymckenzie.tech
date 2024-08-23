<script setup lang="ts">
import type { Post } from '~~/types/content';

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const { data } = await useFetch<{ post: Post; keywords: string[] }>(`/api/blog/${slug.value}`);
const post = computed(() => data.value?.post);
const keywords = computed(() => data.value?.keywords?.join(', ') ?? '');

if (!post.value) {
  await navigateTo('/blog');
}
</script>

<template>
  <main v-if="post" class="mx-auto py-12">
    <Head>
      <Meta name="description" :content="post.description" />
      <Meta name="keywords" :content="keywords" />
    </Head>
    <article class="prose dark:prose-invert mx-auto">
      <h1 class="text-2xl sm:text-center">
        {{ post!.title }}
      </h1>
      <div class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tighter">
        <FormattedDate :date="post!.pubDate" />
        <UBadge :label="post!.category" />
        <FormattedViews v-if="post?.views" :views="post.views" />
      </div>
      <NuxtImg
        :src="post!.heroImage"
        :alt="`${post!.title} blog meme image`"
        sizes="100vw sm:50vw md:400px"
        class="mx-auto rounded-md"
      />
      <div class="text-sm leading-6 dark:text-neutral-400" v-html="post?.content" />
    </article>
    <div class="flex justify-center pt-8">
      <UButton to="/blog">
        Back to blog
      </UButton>
    </div>
  </main>
</template>
