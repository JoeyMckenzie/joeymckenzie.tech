<script setup lang="ts">
const props = defineProps<{ date: Date }>();
</script>

<template>
  <time datetime="{{" props.date.toISOString()}} class="text-neutral-400">
    {{
      props.date.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }}
  </time>
</template>
