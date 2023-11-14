<script setup lang="ts">
const links = [
  {
    display: 'Home',
    href: '/',
  },
  {
    display: 'About',
    href: '/about',
  },
  {
    display: 'Blog',
    href: '/blog',
  },
];
</script>

<template>
  <nav class="flex flex-row items-center justify-center gap-x-2 px-6 py-8">
    <ShadButton
      v-for="{ display, href } of links"
      :key="display"
      variant="outline"
      as="a"
      :href="href"
    >
      {{ display }}
    </ShadButton>
    <ThemeToggle />
  </nav>
</template>
