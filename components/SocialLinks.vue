<script setup lang="ts">
const links = [
  {
    name: 'i-tabler-brand-github',
    to: 'https://github.com/joeymckenzie',
  },
  {
    name: 'i-tabler-brand-linkedin',
    to: 'https://linkedin.com/in/joeymckenzie',
  },
  {
    name: 'i-tabler-brand-twitter',
    to: 'https://x.com/_joeyMcKenzie',
  },
];
</script>

<template>
  <div class="grid grid-cols-3 justify-center py-12">
    <NuxtLink v-for="{ name, to } of links" :key="name" :to external class="inline-flex justify-center">
      <UIcon class="size-6" :name />
    </NuxtLink>
  </div>
</template>
