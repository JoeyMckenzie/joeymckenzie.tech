<script setup lang="ts">
const config = useRuntimeConfig();
const commitSha = config.public.commitSha as string;
const hashRef = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${commitSha}`;
const hashDisplay = commitSha?.substring(0, 6);

const providers = [
  {
    display: 'Netlify',
    name: 'i-bxl-netlify',
    href: 'https://netlify.com',
    classes: 'text-green-600',
  },
  {
    display: 'Nuxt',
    name: 'i-logos-nuxt-icon',
    href: 'https://nuxt.com',
  },
  {
    display: 'TursoDB',
    name: 'i-simple-icons-turso',
    href: 'https://turso.tech',
  },
  {
    display: 'Drizzle ORM',
    name: 'i-simple-icons-drizzle',
    href: 'https://orm.drizzle.team/',
  },
];
</script>

<template>
  <div class="flex flex-row items-center justify-center gap-x-2 py-12">
    <p class="text-xs text-neutral-500">
      Powered by
    </p>
    <a v-for="{ name, display, href, classes } of providers" :key="name" :href class="inline-flex justify-center transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
      <span class="sr-only">{{ display }}</span>
      <UIcon :class="`size-6 ${classes}`" :name />
    </a>
    <ULink :to="hashRef" class="text-xs text-neutral-500 hover:underline">
      {{ hashDisplay }}
    </ULink>
  </div>
</template>
