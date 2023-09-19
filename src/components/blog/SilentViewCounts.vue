<script setup lang="ts">
import { provide } from 'vue';

const props = defineProps<{
  apiBaseUrl: string;
  includeTopCounts: boolean;
}>();

export type ViewCountMeta = {
  count: number;
  slug: string;
};

export type ViewCountMetadata = {
  counts: ViewCountMeta[];
};

try {
  const url = props.includeTopCounts
    ? `${props.apiBaseUrl}/views/top`
    : `${props.apiBaseUrl}/views`;

  const viewCountsResponse = await fetch(url);
  const viewCounts: ViewCountMetadata = await viewCountsResponse.json();

  provide<ViewCountMetadata>('viewCounts', viewCounts);
} catch (e) {
  console.error(e);
}
</script>

<template>
  <div />
</template>
