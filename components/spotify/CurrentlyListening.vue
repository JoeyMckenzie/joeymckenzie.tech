<script setup lang="ts">
import type { NowPlaying } from '~/types/spotify';

defineProps<{ response: NowPlaying }>();
</script>

<template>
  <a
    :href="response.href"
    target="_blank"
    rel="noreferrer"
    class="flex flex-col space-y-1"
  >
    <h2 class="inline-flex justify-center text-xs dark:text-neutral-400">
      Now listening
    </h2>
    <div class="flex flex-row items-center justify-center space-x-2">
      <slot />
      <NuxtImg
        :src="response.albumImageSrc"
        width="30"
        height="30"
        alt="Spotify listenting to"
        class="rounded-sm"
      />
      <div class="flex max-w-64 flex-col">
        <h4
          class="line-clamp-1 overflow-hidden text-ellipsis text-xs font-semibold dark:text-neutral-300"
        >
          {{ response.trackTitle }}
        </h4>
        <p class="line-clamp-1 overflow-hidden text-ellipsis text-xs dark:text-neutral-400">{{ response.artist }}</p>
      </div>
    </div>
  </a>
</template>
