<script setup lang="ts">
const props = defineProps<{
  viewCount: number;
}>();
</script>

<template>
  <div :v-if="props.viewCount > 0" class="font-medium text-neutral-400">
    {{ props.viewCount }} views
  </div>
</template>
