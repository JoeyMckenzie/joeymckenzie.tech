<script lang="ts">
  import type { NowPlayingResponse } from '$lib/spotify';
  import SpotifyCurrentlyPlaying from '$lib/components/SpotifyCurrentlyPlaying.svelte';
  import SpotifyNotPlaying from '$lib/components/SpotifyNotPlaying.svelte';

  export let nowPlaying: NowPlayingResponse;
</script>

{#if nowPlaying?.nowPlaying}
  <SpotifyCurrentlyPlaying {nowPlaying}>
    <slot />
  </SpotifyCurrentlyPlaying>
{:else}
  <SpotifyNotPlaying>
    <slot />
  </SpotifyNotPlaying>
{/if}
