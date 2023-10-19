<script setup lang="ts">
defineProps<{ href: string }>();
</script>

<template>
  <NuxtLink
    :to="href"
    class="inline-flex rounded px-2 py-1 font-roboto-mono font-medium text-neutral-400 hover:bg-neutral-700"
    active-class="border border-transparent bg-neutral-800 text-neutral-300 focus:outline-none"
  >
    <slot />
  </NuxtLink>
</template>
