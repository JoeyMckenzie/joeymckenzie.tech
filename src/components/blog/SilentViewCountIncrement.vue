<script setup lang="ts">
import { computed } from 'vue';

type Props = {
  slug: string;
  apiBaseUrl: string;
};

const props = defineProps<Props>();
const url = computed(() => `${props.apiBaseUrl}/${props.slug}`);

// Fire and forget, no need to block rendering
fetch(url.value, {
  method: 'POST',
}).catch(console.error);
</script>

<template>
  <div />
</template>
