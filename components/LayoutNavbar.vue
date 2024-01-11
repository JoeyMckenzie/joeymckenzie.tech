<script setup lang="ts">
import type { Button } from './ui/button';

type NavLinkProps = {
  href: string;
  display: string;
};

const links: NavLinkProps[] = [
  {
    display: 'Home',
    href: '/',
  },
  {
    display: 'Now',
    href: '/now',
  },
  {
    display: 'Blog',
    href: '/blog',
  },
];
</script>

<template>
  <header>
    <nav class="flex flex-row items-center justify-center gap-x-2 px-6 py-8">
      <div class="space-x-2">
        <NuxtLink v-for="{ display, href } in links" :key="display" :to="href">
          <Button variant="outline" size="default">{{ display }}</Button>
        </NuxtLink>
      </div>
      <ThemeToggle />
    </nav>
  </header>
</template>
