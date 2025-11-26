@props([
    'href' => '',
    'albumImageSrc' => '',
    'trackTitle' => '',
    'artist' => '',
])

<a class="flex flex-col justify-center gap-1" href="{{ $href }}" rel="noreferrer" target="_blank">
    <flux:heading>Currently listening</flux:heading>
    <div class="flex flex-row items-center justify-center space-x-2 max-w-sm">
        <x-icons.spotify />
        <img class="rounded-sm" src="{{ $albumImageSrc }}" alt="Spotify listening to" height="30" width="30" />
        <div class="flex max-w-[16rem] flex-col text-left">
            <flux:subheading class="text-sm line-clamp-1 text-ellipsis">
                {{ $trackTitle }}
            </flux:subheading>
            <flux:text class="text-xs line-clamp-1 text-ellipsis">
                {{ $artist }}
            </flux:text>
        </div>
    </div>
</a>
