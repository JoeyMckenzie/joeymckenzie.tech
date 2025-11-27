@props([
    'href' => '',
    'albumImageSrc' => '',
    'trackTitle' => '',
    'artist' => '',
])

<a href="{{ $href }}" target="_blank" rel="noreferrer"
    class="group block max-w-xs rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800/70 dark:bg-zinc-900/80">
    <div class="flex items-center gap-4">
        <img class="size-12 rounded-sm object-cover shadow-md" src="{{ $albumImageSrc }}" alt="{{ $trackTitle }} cover"
            loading="lazy" />
        <div class="flex-1 space-y-1 text-left">
            <flux:subheading class="text-base font-semibold leading-tight line-clamp-1 text-ellipsis">
                {{ htmlspecialchars($trackTitle) }}
            </flux:subheading>
            <flux:text class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                {{ $artist }}
            </flux:text>
            <flux:text class="text-xs font-semibold tracking-wide text-spotify">
                Now playing
            </flux:text>
        </div>
    </div>
</a>
