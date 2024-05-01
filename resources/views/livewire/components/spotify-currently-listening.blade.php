@if ($nowPlaying->nowPlaying)
    <x-spotify-now-playing
        :href="$nowPlaying->href"
        :album-image-src="$nowPlaying->albumImageSrc"
        :track-title="$nowPlaying->trackTitle"
        :artist="$nowPlaying->artist"
    />
@else
    <x-spotify-not-playing />
@endif
