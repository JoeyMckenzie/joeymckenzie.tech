<script setup lang="ts">
import { useBlogCounts } from './use-blog-counts';

const props = defineProps<{
  apiBaseUrl: string;
  includeTopCounts: boolean;
}>();

const { loadViewCounts } = useBlogCounts();

try {
  await loadViewCounts(props.apiBaseUrl, props.includeTopCounts);
} catch (e) {
  console.error(e);
}
</script>

<template>
  <div />
</template>
