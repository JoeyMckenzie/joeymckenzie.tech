<script setup lang="ts">
import type { MergedPostContent } from '~/types/content';

defineProps<{
  postPreview: MergedPostContent;
}>();
</script>

<template>
  <article
    class="flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1"
  >
    <div class="flex items-center gap-x-4 text-xs">
      <FormattedDate :date="postPreview.pubDate" />
      <UBadge :label="postPreview.category">
        {{ postPreview.category }}
      </UBadge>
      <FormattedViews :views="postPreview.views" />
    </div>
    <ULink :to="postPreview._path">
      <div class="group relative">
        <h2
          class="mt-3 font-semibold leading-6 tracking-tighter text-neutral-700 group-hover:text-neutral-400 dark:text-neutral-300"
        >
          <span class="absolute inset-0" />
          {{ postPreview.title }}
        </h2>
        <p class="mt-5 line-clamp-3 text-sm leading-6 text-neutral-400">
          {{ postPreview.description }}
        </p>
      </div>
    </ULink>
  </article>
</template>
