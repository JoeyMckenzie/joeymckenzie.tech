<script setup lang="ts">
import type { NowPlaying } from '~/types/spotify';

const { data, status } = await useFetch<NowPlaying>('/api/spotify');
const pending = computed(() => status.value === 'pending');
</script>

<template>
  <div v-if="pending">
    <SpotifyNotCurrentlyListening text="Loading...">
      <slot />
    </SpotifyNotCurrentlyListening>
  </div>
  <div v-else-if="!pending && data?.nowPlaying">
    <SpotifyCurrentlyListening :response="data">
      <slot />
    </SpotifyCurrentlyListening>
  </div>
  <div v-else>
    <SpotifyNotCurrentlyListening><slot /></SpotifyNotCurrentlyListening>
  </div>
</template>
