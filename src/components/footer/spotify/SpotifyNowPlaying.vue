<script setup lang="ts">
import { reactive, ref } from 'vue';
import SpotifyCurrentlyPlaying from './SpotifyCurrentlyPlaying.vue';
import SpotifyNotCurrentlyListening from './SpotifyNotCurrentlyListening.vue';

const props = defineProps<{
  nowPlayingUrl: string;
}>();

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

// TODO: This can be replaced with suspense, currently not smart enough to figure it out
try {
  const response = await fetch(props.nowPlayingUrl);
  nowPlaying.response = await response.json();
} catch (e) {
  console.error(e);
} finally {
  loading.value = false;
}
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
