<script lang="ts">
  import SpotifyCurrentlyPlaying from '$lib/components/SpotifyCurrentlyPlaying.svelte';
  import SpotifyNotPlaying from '$lib/components/SpotifyNotPlaying.svelte';
  import type { NowPlayingResponse } from '$lib/spotify';

  const { nowPlaying } = $props<{ nowPlaying: NowPlayingResponse }>();
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
