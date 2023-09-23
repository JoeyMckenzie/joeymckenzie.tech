<script setup lang="ts">
export type BlogPostProps = {
  slug: string;
  pubDate: Date;
  category: string;
  description: string;
  title: string;
  viewCount: number;
};

const props = defineProps<BlogPostProps>();
</script>

<template>
  <article class="flex max-w-xl flex-col items-start">
    <div class="flex items-center gap-x-4 text-xs">
      <FormattedDate :date="props.pubDate" />
      <span
        class="relative z-10 rounded-full bg-neutral-700 px-3 py-1.5 font-medium text-neutral-300"
        >{{ category }}</span
      >
      <BlogPostViewCount :view-count="props.viewCount" />
    </div>
    <NuxtLink :to="props.slug">
      <div class="group relative">
        <h3
          class="mt-3 font-roboto-mono text-lg leading-6 tracking-tighter text-neutral-300 group-hover:text-neutral-400"
        >
          <span class="absolute inset-0"></span>
          {{ title }}
        </h3>
        <p class="mt-5 line-clamp-3 text-sm leading-6 text-neutral-400">
          {{ description }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>
