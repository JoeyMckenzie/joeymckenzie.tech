<script setup lang="ts">
defineProps<{
  viewCount: number;
}>();
</script>

<template>
  <div :v-if="viewCount > 0" class="font-medium text-neutral-400">
    {{ viewCount }} views
  </div>
</template>
