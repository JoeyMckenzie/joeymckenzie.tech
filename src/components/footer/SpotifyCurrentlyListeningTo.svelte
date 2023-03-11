<script lang="ts">
  export let href = '';
  export let albumImageSrc = '';
  export let trackTitle = '';
  export let artist = '';
</script>

<a
  {href}
  target="_blank"
  rel="noreferrer"
  class="flex flex-col space-y-1 pt-6 md:pt-0"
>
  <h2
    class="inline-flex justify-center font-ubuntu text-xs text-neutral-400 md:justify-start"
  >
    Now listening
  </h2>
  <div class="flex flex-row items-center justify-center space-x-2">
    <slot />
    <img
      src={albumImageSrc}
      width="30"
      height="30"
      alt="Spotify listenting to"
      class="rounded-sm"
    />
    <div class="flex flex-col">
      <h4 class="text-sm font-semibold text-neutral-300">{trackTitle}</h4>
      <p class="text-xs text-neutral-400">{artist}</p>
    </div>
  </div>
</a>
