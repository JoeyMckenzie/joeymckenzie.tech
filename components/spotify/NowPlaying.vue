<script setup lang="ts">
import { reactive, ref } from 'vue';

export type NowPlayingResponse = {
  href: string;
  albumImageSrc: string;
  trackTitle: string;
  artist: string;
  nowPlaying: boolean;
};

const loading = ref(true);
const nowPlaying = reactive<{ response: NowPlayingResponse }>({
  response: {
    href: '',
    albumImageSrc: '',
    trackTitle: '',
    artist: '',
    nowPlaying: false,
  },
});

const response = await useFetch('/api/spotify');
</script>

<template>
  <div v-if="loading">
    <SpotifyNotCurrentlyListening text="Loading..."
      ><slot
    /></SpotifyNotCurrentlyListening>
  </div>
  <div v-else-if="!loading && nowPlaying.response.nowPlaying">
    <SpotifyCurrentlyPlaying :response="nowPlaying.response"
      ><slot
    /></SpotifyCurrentlyPlaying>
  </div>
  <div v-else>
    <SpotifyNotCurrentlyListening><slot /></SpotifyNotCurrentlyListening>
  </div>
</template>
