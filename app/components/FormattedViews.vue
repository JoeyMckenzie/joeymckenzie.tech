<script setup lang="ts">
const props = defineProps<{
  views: number;
}>();

const formattedViews = computed(() => Intl.NumberFormat().format(props.views));
</script>

<template>
  <div v-if="views > 0">
    {{ formattedViews }} views
  </div>
</template>
