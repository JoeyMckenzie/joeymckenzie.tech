<script setup lang="ts">
const colorMode = useColorMode();

function toggleColorMode() {
  if (colorMode.preference === 'light') {
    colorMode.preference = 'dark';
  }
  else {
    colorMode.preference = 'light';
  }
}
</script>

<template>
  <NuxtLayout>
    <ColorScheme placeholder="..." tag="span">
      <button @click="toggleColorMode">
        <Icon v-if="$colorMode.preference === 'light'" size="24" class="text-neutral-500" name="line-md:moon-alt-to-sunny-outline-loop-transition" />
        <Icon v-if="$colorMode.preference === 'dark'" size="24" class="text-neutral-500" name="line-md:sunny-outline-to-moon-alt-loop-transition" />
      </button>
      <Body class="flex max-w-7xl flex-col bg-white px-2 py-8 sm:px-6 lg:px-8 dark:bg-neutral-950">
        <Navbar />
        <NuxtPage />
      </Body>
    </ColorScheme>
  </NuxtLayout>
</template>

<style>
.page-enter-active, .page-leave-active {
  transition: all 0.2s;
}

.page-enter-from, .page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
