<script setup lang="ts">
import type { PostPreview } from '~/types/content';

defineProps<{
  postPreview: PostPreview;
}>();
</script>

<template>
  <ULink :to="postPreview._path" class="transition duration-150 ease-in-out hover:-translate-y-1">
    <article>
      <div class="flex flex-row items-center space-x-2 text-xs">
        <FormattedDate :date="postPreview.pubDate" />
        <UBadge :label="postPreview.category">
          {{ postPreview.category }}
        </UBadge>
        <FormattedViews :views="postPreview.views" />
      </div>
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
    </article>
  </ULink>
</template>
