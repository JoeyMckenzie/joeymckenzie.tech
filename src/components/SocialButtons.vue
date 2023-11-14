<script setup lang="ts">
const socials = [
  {
    href: 'https://github.com/joeymckenzie',
    icon: 'mdi:github',
    display: 'GitHub',
    external: 'gg:external',
  },
  {
    href: 'https://linkedin.com/in/JoeyMcKenzie',
    icon: 'mdi:linkedin',
    display: 'LinkedIn',
    external: 'gg:external',
  },
  {
    href: 'https://x.com/_joeyMcKenzie',
    icon: 'mdi:twitter',
    display: 'Twitter',
    external: 'gg:external',
  },
  {
    href: 'https://resume.joeymckenzie.tech/JoeyMcKenzie_resume.pdf',
    icon: 'carbon:identification',
    display: 'Resume',
    external: 'material-symbols:download-sharp',
  },
];
</script>

<template>
  <div
    class="mx-auto grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 py-8 sm:grid-cols-4"
  >
    <ShadButton
      v-for="social of socials"
      :key="social.display"
      as="a"
      variant="outline"
      :href="social.href"
      class="flex flex-row gap-x-2"
    >
      <Icon :name="social.icon" class="h-5 w-5" />
      {{ social.display }}
      <Icon :name="social.external" class="h-5 w-5" />
    </ShadButton>
  </div>
</template>
