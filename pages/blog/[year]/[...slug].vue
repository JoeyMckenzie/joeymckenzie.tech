<script setup lang="ts">
import FormattedViews from '~/components/FormattedViews.vue';

const route = useRoute();
const { data } = await useFetch(`/api/views/${route.params.slug}`);
</script>

<template>
  <main class="mx-auto py-12">
    <ContentDoc v-slot="{ doc }">
      <article class="prose dark:prose-invert mx-auto">
        <h1 class="text-2xl sm:text-center">
          {{ doc.title }}
        </h1>
        <div class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tighter">
          <FormattedDate :date="doc.pubDate" />
          <UBadge :label="doc.category" />
          <FormattedViews :views="data?.views" />
        </div>
        <NuxtImg
          :src="doc.heroImage" :alt="`${doc.title} blog meme image`"
          class="mx-auto rounded-md"
        />
        <ContentRenderer class="text-sm leading-6 dark:text-neutral-400" :value="doc" />
      </article>
    </ContentDoc>
    <div class="flex justify-center pt-8">
      <UButton to="/blog">
        Back to blog
      </UButton>
    </div>
  </main>
</template>
