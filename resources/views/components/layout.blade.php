<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ $title ?? config('app.name') }}</title>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- Styles / Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @fluxAppearance
</head>

<body class="min-h-screen">
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
                <a href="{{ $link['href'] }}"
                    class="transition-colors {{ $link['active'] ? 'text-accent dark:text-accent-content' : 'hover:text-zinc-700 dark:hover:text-zinc-200' }}">
                    {{ $link['label'] }}
                </a>
                @if (!$loop->last)
                    <span class="px-3 text-zinc-400 dark:text-zinc-600">/</span>
                @endif
            @endforeach
        </nav>
    </div>

    <div class="flex justify-center w-full min-h-[calc(100vh-96px)] px-6 pb-12">
        {{ $slot }}
    </div>
    @fluxScripts
</body>

</html>
