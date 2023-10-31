<script setup lang="ts">
defineProps<{ date: Date }>();
</script>

<template>
  <time :datetime="date.toISOString()" class="text-neutral-400">
    {{
      date.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }}
  </time>
</template>
