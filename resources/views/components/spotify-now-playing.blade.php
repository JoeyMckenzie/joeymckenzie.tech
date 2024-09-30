<a href="{{ $href }}" class="flex flex-col space-y-1" rel="noreferrer" target="_blank">
    <h2 class="font-ubuntu inline-flex justify-center text-xs">
        Now listening
    </h2>
    <div class="flex flex-row items-center justify-center space-x-2">
        {{ $slot }}
        <img src="{{ $albumImageSrc }}" alt="Spotify listening to" class="rounded-sm" height="30" width="30" />
        <div class="flex max-w-[16rem] flex-col">
            <h4 class="line-clamp-1 overflow-hidden text-ellipsis text-xs font-semibold">
                {{ $trackTitle }}
            </h4>
            <p class="line-clamp-1 overflow-hidden text-ellipsis text-xs">
                {{ $artist }}
            </p>
        </div>
    </div>
</a>
