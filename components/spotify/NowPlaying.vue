<script setup lang="ts">
const response = await useFetch('/api/spotify');
</script>

<template>
  <div v-if="response.pending.value">
    <SpotifyNotCurrentlyListening text="Loading..."
      ><slot
    /></SpotifyNotCurrentlyListening>
  </div>
  <div v-else-if="!response.pending.value && response.data?.value?.nowPlaying">
    <SpotifyCurrentlyPlaying :response="response.data.value!"
      ><slot
    /></SpotifyCurrentlyPlaying>
  </div>
  <div v-else>
    <SpotifyNotCurrentlyListening><slot /></SpotifyNotCurrentlyListening>
  </div>
</template>
