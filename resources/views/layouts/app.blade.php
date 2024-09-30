<!DOCTYPE html>
<html data-theme="dim" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title') | {{ config('app.name', 'joeymckenzie.tech') }}</title>

    <!-- Favicon -->
    <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180">
    <link type="image/png" href="/favicon-32x32.png" rel="icon" sizes="32x32">
    <link type="image/png" href="/favicon-16x16.png" rel="icon" sizes="16x16">
    <link href="/site.webmanifest" rel="manifest">

    <!-- Fonts -->
    <link href="https://fonts.bunny.net" rel="preconnect">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Basic Meta Tags -->
    <meta name="description" content="A blog about software, programming, design, and sometimes beer.">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://joeymckenzie.tech/">
    <meta property="og:title"
        content="A blog about software, programming, design, and sometimes beer | joeymckenzie.tech">
    <meta property="og:description" content="A blog about software, programming, design, and sometimes beer.">
    <meta property="og:image" content="https://joeymckenzie.tech/path-to-your-logo-or-featured-image.jpg">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://joeymckenzie.tech/">
    <meta property="twitter:title"
        content="A blog about software, programming, design, and sometimes beer | Doghead Digital">
    <meta property="twitter:description" content="A blog about software, programming, design, and sometimes beer.">
    <meta property="twitter:image" content="https://joeymckenzie.tech/path-to-your-logo-or-featured-image.jpg">

    <!-- Additional SEO Tags -->
    @yield('meta')
    <meta name="keywords" content="programming, tech, software engineering, laravel">
    <meta name="author" content="Joey McKenzie">
    <link href="https://joeymckenzie.tech/" rel="canonical">

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="font-sans antialiased">
    <div class="min-h-screen">
        @include('layouts.navigation')

        <main>
            {{ $slot }}
        </main>

        @include('layouts.footer')
    </div>
</body>

</html>
