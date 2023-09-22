<script setup lang="ts">
export type SocialButtonProps = {
  href: string;
  name: string;
  display: string;
  icon: string;
};

const props = defineProps<{
  href: string;
  name: string;
  display: string;
  icon: string;
}>();
</script>

<template>
  <NuxtLink
    :external="true"
    :href="href"
    type="button"
    class="inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-400 shadow-sm hover:bg-neutral-700 focus:outline-none"
  >
    <span class="sr-only">{{ props.name }}</span>
    <Icon class="mr-3 h-5 w-5" :name="props.icon" />
    {{ props.display }}
    <Icon
      name="tabler:external-link"
      class="ml-3 -mr-1 h-5 w-5"
      aria-hidden="true"
    />
  </NuxtLink>
</template>
