<script setup lang="ts">
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
  <header>
    <nav class="flex flex-row items-center justify-center gap-x-2 px-6 pt-8">
      <HtmlTag additional-classes="hidden sm:block" tag-name="menu">
        <NavLink v-for="link in links" :key="link.display" :href="link.href">{{
          link.display
        }}</NavLink>
      </HtmlTag>
    </nav>
  </header>
</template>
