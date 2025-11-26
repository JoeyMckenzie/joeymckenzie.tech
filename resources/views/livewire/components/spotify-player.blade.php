@if ($nowPlaying->nowPlaying)
    <x-spotify-now-listening href="{{ $nowPlaying->href }}" artist="{{ $nowPlaying->artist }}"
        album-image-src="{{ $nowPlaying->albumImageSrc }}" track-title="{{ $nowPlaying->trackTitle }}" />
@else
    <x-spotify-silent />
@endif
