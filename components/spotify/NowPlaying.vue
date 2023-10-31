<script setup lang="ts">
import type { NowPlaying } from '~/types/spotify';

const { data, pending } = await useFetch<NowPlaying>('/api/spotify');
</script>

<template>
  <div v-if="pending">
    <SpotifyNotCurrentlyListening text="Loading..."
      ><slot
    /></SpotifyNotCurrentlyListening>
  </div>
  <div v-else-if="!pending && data?.nowPlaying">
    <SpotifyCurrentlyPlaying :response="data"><slot /></SpotifyCurrentlyPlaying>
  </div>
  <div v-else>
    <SpotifyNotCurrentlyListening><slot /></SpotifyNotCurrentlyListening>
  </div>
</template>
