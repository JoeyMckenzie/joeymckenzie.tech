<script lang="ts">
  import SpotifyCurrentlyListeningTo from './SpotifyCurrentlyListeningTo.svelte';
  import SpotifyNotCurrentlyListening from './SpotifyNotCurrentlyListening.svelte';

  export let SHUTTLE_NOW_PLAYING_URL = '';

  type NowPlayingResponse = {
    href: string;
    albumImageSrc: string;
    trackTitle: string;
    artist: string;
    nowPlaying: boolean;
  };

  async function getNowPlaying(): Promise<NowPlayingResponse> {
    const response = await fetch(SHUTTLE_NOW_PLAYING_URL);
    return response.json();
  }
</script>

{#await getNowPlaying() then nowPlaying}
  <SpotifyCurrentlyListeningTo
    albumImageSrc={nowPlaying.albumImageSrc}
    href={nowPlaying.href}
    artist={nowPlaying.artist}
    trackTitle={nowPlaying.trackTitle}><slot /></SpotifyCurrentlyListeningTo
  >
{:catch}
  <SpotifyNotCurrentlyListening><slot /></SpotifyNotCurrentlyListening>
{/await}
