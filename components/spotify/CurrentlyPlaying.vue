<script setup lang="ts">
import type { NowPlaying } from '~/types/spotify';

const props = defineProps<{ response: NowPlaying }>();
</script>

<template>
  <a
    :href="props.response.href"
    target="_blank"
    rel="noreferrer"
    class="flex flex-col space-y-1"
  >
    <h2
      class="inline-flex justify-center font-ubuntu text-xs text-neutral-400 md:justify-start"
    >
      Now listening
    </h2>
    <div class="flex flex-row items-center justify-center space-x-2">
      <slot />
      <img
        :src="props.response.albumImageSrc"
        width="30"
        height="30"
        alt="Spotify listenting to"
        class="rounded-sm"
      />
      <div class="flex flex-col truncate">
        <h4 class="text-xs font-semibold text-neutral-300">
          {{ props.response.trackTitle }}
        </h4>
        <p class="text-xs text-neutral-400">{{ props.response.artist }}</p>
      </div>
    </div>
  </a>
</template>
