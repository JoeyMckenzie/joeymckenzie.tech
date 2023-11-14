<script setup lang="ts">
const colorMode = useColorMode();
const toggleMode = () => {
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';
};
</script>

<template>
  <ShadButton variant="outline" @click="toggleMode">
    <Icon
      name="solar:sun-broken"
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Icon
      name="radix-icons:moon"
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </ShadButton>
</template>
