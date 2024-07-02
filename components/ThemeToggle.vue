<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'),
});
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-pixelarticons-moon' : 'i-pixelarticons-sun'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="isDark = !isDark"
    />
    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
