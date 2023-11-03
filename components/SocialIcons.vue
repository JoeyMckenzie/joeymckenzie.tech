<script setup lang="ts">
const socials = [
  {
    href: 'https://twitter.com/_joeyMcKenzie',
    display: 'Twitter',
    icon: 'simple-icons:x',
  },
  {
    href: 'https://github.com/JoeyMcKenzie',
    display: 'GitHub',
    icon: 'mdi:github',
  },
  {
    href: 'https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#',
    display: 'YouTube',
    icon: 'mdi:youtube',
  },
  {
    href: 'https://twitch.tv/JoeTheDevMan',
    display: 'Twitch',
    icon: 'mdi:twitch',
  },
  {
    href: 'https://linkedin.com/in/JoeyMcKenzie',
    display: 'LinkedIn',
    icon: 'mdi:linkedin',
  },
];
</script>

<template>
  <div>
    <div class="flex justify-center space-x-6 md:order-2">
      <NuxtLink
        v-for="social in socials"
        :key="social.display"
        :external="true"
        :href="social.href"
        class="text-neutral-400 hover:text-neutral-500"
      >
        <span class="sr-only">{{ social.display }}</span>
        <Icon
          :name="social.icon"
          class="h-6 w-6 transition duration-150 ease-in-out hover:-translate-y-1 hover:scale-110"
          aria-hidden="true"
        />
      </NuxtLink>
    </div>
  </div>
</template>
