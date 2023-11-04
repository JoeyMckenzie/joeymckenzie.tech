<script lang="ts">
  import type { NowPlayingResponse } from '$lib/spotify';

  export let nowPlaying: NowPlayingResponse;
</script>

<a
  class="flex flex-col space-y-1"
  href={nowPlaying.href}
  rel="noreferrer"
  target="_blank"
>
  <h2 class="font-ubuntu inline-flex justify-center text-xs">Now listening</h2>
  <div class="flex flex-row items-center justify-center space-x-2">
    <slot />
    <img
      alt="Spotify listenting to"
      class="rounded-sm"
      height="30"
      src={nowPlaying.albumImageSrc}
      width="30"
    />
    <div class="flex max-w-[16rem] flex-col">
      <h4
        class="line-clamp-1 overflow-hidden text-ellipsis text-xs font-semibold"
      >
        {nowPlaying.trackTitle}
      </h4>
      <p class="text-xs">{nowPlaying.artist}</p>
    </div>
  </div>
</a>
