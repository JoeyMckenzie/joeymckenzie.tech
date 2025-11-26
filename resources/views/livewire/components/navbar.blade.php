<div class="w-full px-6 py-8">
    <flux:navbar class="flex justify-center font-mono text-sm">
        @foreach ($navLinks as $link)
            <flux:navbar.item href="{{ $link['href'] }}" :current="$link['active']">
                {{ $link['label'] }}
    </flux:navbar>
    @if (!$loop->last)
        <span class="text-zinc-400 dark:text-zinc-600">/</span>
    @endif
    @endforeach
    </flux:navbar>
</div>
