<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ $title }} | {{ config('app.name') }}</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="{{ $description ?? 'Long-form thoughts on Laravel, PHP, and whatever else I\'m tinkering with by Joey McKenzie.' }}">
    <meta name="author" content="Joey McKenzie">
    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Open Graph -->
    <meta property="og:title" content="{{ $title }} | {{ config('app.name') }}">
    <meta property="og:description" content="{{ $description ?? 'Long-form thoughts on Laravel, PHP, and whatever else I\'m tinkering with by Joey McKenzie.' }}">
    <meta property="og:type" content="{{ $ogType ?? 'website' }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:image" content="{{ $ogImage ?? asset('/og-default.jpg') }}">
    <meta property="og:site_name" content="{{ config('app.name') }}">

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $title }} | {{ config('app.name') }}">
    <meta name="twitter:description" content="{{ $description ?? 'Long-form thoughts on Laravel, PHP, and whatever else I\'m tinkering with by Joey McKenzie.' }}">
    <meta name="twitter:image" content="{{ $ogImage ?? asset('/og-default.jpg') }}">

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- Styles / Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @fluxAppearance

    <!-- Structured Data -->
    @isset($structuredData)
        <script type="application/ld+json">
            {!! json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
        </script>
    @endisset
</head>

<body class="min-h-screen">
    <livewire:components.navbar />
    <div class="flex justify-center w-full min-h-[calc(100vh-96px)]">
        {{ $slot }}
    </div>
    <x-footer />
    @fluxScripts
</body>

</html>
