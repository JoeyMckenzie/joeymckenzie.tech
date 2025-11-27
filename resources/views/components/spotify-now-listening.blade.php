@props([
    'href' => '',
    'albumImageSrc' => '',
    'trackTitle' => '',
    'artist' => '',
])

<a href="{{ $href }}" target="_blank" rel="noreferrer"
    class="max-w-sm rounded-2xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/60">
    <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-spotify/10 text-spotify">
            <x-icons.spotify class="h-5 w-5" />
        </div>

        <div class="flex items-center gap-3">
            <img class="h-14 w-14 rounded-lg object-cover shadow-sm" src="{{ $albumImageSrc }}"
                alt="{{ $trackTitle }} cover" loading="lazy" />
            <div class="max-w-[12rem] text-left">
                <flux:subheading class="text-sm font-semibold line-clamp-2">
                    {{ $trackTitle }}
                </flux:subheading>
                <flux:text class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {{ $artist }}
                </flux:text>
                <flux:text class="mt-1 text-[11px] uppercase tracking-wide text-spotify">
                    Currently playing
                </flux:text>
            </div>
        </div>
    </div>
</a>
