<script setup lang="ts">
const links = [
  {
    name: 'i-mdi-github',
    to: 'https://github.com/joeymckenzie',
  },
  {
    name: 'i-mdi-linkedin',
    to: 'https://linkedin.com/in/joeymckenzie',
  },
  {
    name: 'i-hugeicons-new-twitter',
    to: 'https://x.com/_joeyMcKenzie',
  },
];
</script>

<template>
  <div class="flex flex-row justify-center gap-x-1 py-12">
    <NuxtLink v-for="{ name, to } of links" :key="name" :to external class="inline-flex justify-center">
      <UIcon class="size-6" :name />
    </NuxtLink>
  </div>
</template>
