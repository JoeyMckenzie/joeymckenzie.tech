<script lang="ts">
  import SpotifyCurrentlyListeningTo from './SpotifyCurrentlyPlaying.svelte';
  import SpotifyNotCurrentlyListening from './SpotifyNotCurrentlyListening.svelte';

  export let nowPlayingUrl = '';

  type NowPlayingResponse = {
    href: string;
    albumImageSrc: string;
    trackTitle: string;
    artist: string;
    nowPlaying: boolean;
  };

  async function getNowPlaying(): Promise<NowPlayingResponse> {
    const response = await fetch(nowPlayingUrl);
    return response.json();
  }
</script>

{#await getNowPlaying()}
  <SpotifyNotCurrentlyListening text="Loading..."
    ><slot /></SpotifyNotCurrentlyListening
  >
{:then { albumImageSrc, artist, href, nowPlaying, trackTitle }}
  {#if nowPlaying}
    <SpotifyCurrentlyListeningTo {albumImageSrc} {href} {artist} {trackTitle}
      ><slot /></SpotifyCurrentlyListeningTo
    >
  {:else}
    <SpotifyNotCurrentlyListening><slot /></SpotifyNotCurrentlyListening>
  {/if}
{:catch}
  <SpotifyNotCurrentlyListening><slot /></SpotifyNotCurrentlyListening>
{/await}
