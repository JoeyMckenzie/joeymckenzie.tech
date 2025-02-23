@if ($nowPlaying !== null && $nowPlaying->nowPlaying)
    <span>I'm listening to:</span>
    <a href="{{ $nowPlaying->href }}">{{ $nowPlaying->trackTitle }}</a>
@endif
