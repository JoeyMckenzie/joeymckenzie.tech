@php
    $navLinks = [
        [
            'label' => 'home',
            'href' => route('home'),
            'active' => request()->routeIs('home'),
        ],
        [
            'label' => 'now',
            'href' => route('now'),
            'active' => request()->routeIs('now'),
        ],
        [
            'label' => 'blog',
            'href' => route('blog.index'),
            'active' => request()->routeIs('blog.*'),
        ],
    ];
@endphp

<div class="w-full px-6 py-8">
    <nav class="flex justify-center font-mono text-sm text-zinc-500 dark:text-zinc-400">
        @foreach ($navLinks as $link)
            <flux:link variant="subtle" href="{{ $link['href'] }}">
                {{ $link['label'] }}
            </flux:link>
            @if (!$loop->last)
                <span class="px-3 text-zinc-400 dark:text-zinc-600">/</span>
            @endif
        @endforeach
    </nav>
</div>
