<div class="transition-transform transform hover:scale-[1.01] ease-in-out duration-300">
    @if ($nowPlaying->nowPlaying)
        <x-spotify-now-listening href="{{ $nowPlaying->href }}" artist="{{ $nowPlaying->artist }}"
            album-image-src="{{ $nowPlaying->albumImageSrc }}" track-title="{{ $nowPlaying->trackTitle }}" />
    @else
        <x-spotify-silent />
    @endif
</div>
