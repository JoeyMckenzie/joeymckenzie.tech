<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>

<template>
  <span
    class="flex flex-row items-center space-x-0 text-neutral-400 sm:justify-center sm:space-x-2"
  >
    <HtmlTag additional-classes="hidden sm:block text-xl" tag-name="page">
      <h2
        class="font-mono text-2xl font-semibold tracking-tight text-neutral-400 sm:text-3xl"
      >
        {{ props.title }}
      </h2>
    </HtmlTag>
  </span>
</template>
