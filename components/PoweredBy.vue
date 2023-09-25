<script setup lang="ts">
const config = useRuntimeConfig();
const hash = config.public.commitSha;
const hashRef = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${hash}`;
const hashDisplay = hash?.substring(0, 6);
</script>

<template>
  <div
    class="mx-auto inline-flex flex-row items-center gap-x-2 md:order-1 md:mx-0"
  >
    <p class="text-center font-ubuntu text-xs leading-5 text-neutral-500">
      Powered by
    </p>

    <!-- Vue -->
    <NuxtLink :external="true" to="https://vuejs.org">
      <span class="sr-only">Vue</span>
      <Icon name="logos:vue" class="h-4 w-4" />
    </NuxtLink>

    <!-- Netlify -->
    <NuxtLink :external="true" to="https://netlify.com">
      <span class="sr-only">Netlify</span>
      <Icon
        name="simple-icons:netlify"
        class="h-6 w-6 text-teal-500 hover:text-teal-600"
      />
    </NuxtLink>

    <!-- Nuxt -->
    <NuxtLink :external="true" to="https://nuxt.com">
      <span class="sr-only">Nuxt</span>
      <Icon
        name="simple-icons:nuxtdotjs"
        class="h-6 w-6 text-green-500 hover:text-green-400"
      />
    </NuxtLink>

    <!-- Git info -->
    <NuxtLink
      :external="true"
      :to="hashRef"
      class="text-center font-ubuntu text-xs leading-5 text-neutral-500 hover:text-neutral-400"
    >
      {{ hashDisplay }}
    </NuxtLink>
  </div>
</template>
