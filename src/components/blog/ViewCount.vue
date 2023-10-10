<script setup lang="ts">
import { computed } from 'vue';
import { viewCounts } from './view-counts';

const props = defineProps<{
  slug: string;
}>();

const viewCount = computed(
  () => viewCounts.value.find((vc) => vc.slug === props.slug)?.count ?? 0,
);
</script>

<template>
  <div :v-if="viewCount > 0" class="font-medium text-neutral-400">
    {{ viewCount }} views
  </div>
</template>
