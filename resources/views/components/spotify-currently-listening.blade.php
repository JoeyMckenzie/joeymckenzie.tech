@if ($nowPlaying !== null && $nowPlaying->nowPlaying)
    <x-spotify-now-playing :href="$nowPlaying->href" :album-image-src="$nowPlaying->albumImageSrc" :track-title="$nowPlaying->trackTitle" :artist="$nowPlaying->artist">
        {{ $slot }}
    </x-spotify-now-playing>
@else
    <x-spotify-not-playing>
        {{ $slot }}
    </x-spotify-not-playing>
@endif
