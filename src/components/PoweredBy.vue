<script setup lang="ts">
const config = useRuntimeConfig();
const hash = config.public.commitSha;
const hashRef = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${hash}`;
const hashDisplay = hash?.substring(0, 6);
const poweredBy = [
  {
    href: 'https://vuejs.org',
    display: 'Vue',
    icon: 'logos:vue',
  },
  {
    href: 'https://vercel.com',
    display: 'Netlify',
    icon: 'simple-icons:vercel',
    classes: 'text-neutral-100',
  },
  {
    href: 'https://nuxt.com',
    display: 'Nuxt',
    icon: 'simple-icons:nuxtdotjs',
    classes: 'text-green-500 hover:text-green-400',
  },
];
</script>

<template>
  <div
    class="mx-auto inline-flex flex-row items-center gap-x-2 text-sm md:order-1 md:mx-0"
  >
    <p>Powered by</p>

    <NuxtLink
      v-for="provider in poweredBy"
      :key="provider.display"
      :external="true"
      :to="provider.href"
    >
      <span class="sr-only">{{ provider.display }}</span>
      <Icon
        :name="provider.icon"
        :class="`h-6 w-6 transition duration-150 ease-in-out hover:-translate-y-1 hover:scale-110 ${provider.classes}`"
      />
    </NuxtLink>

    <!-- Git info -->
    <NuxtLink :external="true" :to="hashRef">
      {{ hashDisplay }}
    </NuxtLink>
  </div>
</template>
