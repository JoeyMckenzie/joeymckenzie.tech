<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBlogCounts, type ViewCountMeta } from './use-blog-counts';

const props = defineProps<{
  slug: string;
  apiBaseUrl: string;
}>();

const { viewCounts } = useBlogCounts();

const viewCount = ref(0);

async function loadViewCount(apiBaseUrl: string, slug: string) {
  const viewCountResponse = await fetch(`${apiBaseUrl}/views/${slug}`);
  const viewCountMeta: ViewCountMeta = await viewCountResponse.json();
  viewCount.value = viewCountMeta.count;
}

await loadViewCount(props.apiBaseUrl, props.slug);

watch(viewCounts, (updatedViewCounts) => {
  console.log('updatedViewCounts', updatedViewCounts);
  viewCount.value =
    updatedViewCounts?.counts.find(({ slug }) => slug === props.slug)?.count ??
    0;
});
</script>

<template>
  <div :v-if="viewCount > 0" class="font-medium text-neutral-400">
    {{ viewCount }} views
  </div>
</template>
