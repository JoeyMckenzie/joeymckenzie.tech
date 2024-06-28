<script setup lang="ts">
const links = [
  {
    display: 'GitHub',
    name: 'i-mdi-github',
    href: 'https://github.com/joeymckenzie',
  },
  {
    display: 'LinkedIn',
    name: 'i-mdi-linkedin',
    href: 'https://linkedin.com/in/joeymckenzie',
  },
  {
    display: 'Twitter',
    name: 'i-hugeicons-new-twitter',
    href: 'https://x.com/_joeyMcKenzie',
  },
];
</script>

<template>
  <div class="flex flex-row justify-center gap-x-6 py-12">
    <a v-for="{ name, display, href } of links" :key="name" :href class="inline-flex justify-center transition duration-150 ease-in-out hover:-translate-y-1">
      <span class="sr-only">{{ display }}</span>
      <UIcon class="size-6" :name />
    </a>
  </div>
</template>
