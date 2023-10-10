<script setup lang="ts">
import { loadViewCounts } from './view-counts';

const props = defineProps<{
  apiBaseUrl: string;
}>();

await loadViewCounts(props.apiBaseUrl);
</script>

<template><div /></template>
