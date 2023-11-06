<script lang="ts">
  import PoweredBy from '$lib/components/PoweredBy.svelte';
  import SocialIcons from '$lib/components/SocialIcons.svelte';
  import type { NowPlayingResponse } from '$lib/spotify';
  import SpotifyNowPlaying from '$lib/components/SpotifyNowPlaying.svelte';
  import Icon from '@iconify/svelte';

  export let commitSha = '';
  export let nowPlaying: NowPlayingResponse;
</script>

<div
  class="mx-auto mt-auto flex w-full max-w-screen-lg flex-col items-center justify-evenly gap-y-8 p-12 sm:flex-row sm:items-end"
>
  <SocialIcons />
  <SpotifyNowPlaying {nowPlaying}>
    <Icon class="h-6 w-6" icon="logos:spotify-icon" />
  </SpotifyNowPlaying>
  <PoweredBy {commitSha} />
</div>
