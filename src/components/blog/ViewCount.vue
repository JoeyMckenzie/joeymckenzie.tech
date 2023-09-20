<script setup lang="ts">
import { ref } from 'vue';

type ViewCountMeta = {
  count: number;
  slug: string;
};

const props = defineProps<{
  slug: string;
  apiBaseUrl: string;
}>();

const viewCount = ref(0);

async function loadViewCount(apiBaseUrl: string, slug: string) {
  const viewCountResponse = await fetch(`${apiBaseUrl}/views/${slug}`);
  const viewCountMeta: ViewCountMeta = await viewCountResponse.json();
  viewCount.value = viewCountMeta.count;
}

await loadViewCount(props.apiBaseUrl, props.slug);
</script>

<template>
  <div :v-if="viewCount > 0" class="font-medium text-neutral-400">
    {{ viewCount }} views
  </div>
</template>
