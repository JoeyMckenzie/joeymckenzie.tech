<script setup lang="ts">
const props = defineProps<{
  date: string;
}>();

const formattedDate = computed(() => new Date(props.date));
</script>

<template>
  <time :datetime="formattedDate.toISOString()">
    {{
      formattedDate.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }}
  </time>
</template>
