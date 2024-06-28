<script setup lang="ts">
defineProps<{
  title: string;
  blerb?: string | null;
}>();
</script>

<template>
  <div class="py-12 sm:py-16">
    <div class="mx-auto">
      <h2 class="text-2xl font-bold tracking-tight">
        {{ title }}
      </h2>
      <p class="mt-6 text-sm leading-6 dark:text-neutral-400">
        {{ blerb }}
      </p>
    </div>
    <slot />
  </div>
</template>
