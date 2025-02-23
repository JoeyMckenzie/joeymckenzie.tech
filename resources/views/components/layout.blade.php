<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ $title }} | joeymckenzie.tech</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">

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
    <meta property="twitter:image" content="https://joeymckenzie.tech/favicon.ico">

    <!-- Additional SEO Tags -->
    @yield('meta')
    <meta name="keywords" content="programming, tech, software engineering, laravel">
    <meta name="author" content="Joey McKenzie">
    <link href="https://joeymckenzie.tech/" rel="canonical">

    <!-- Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body>
    <x-header :title="$title" :subtitle="$subtitle" :extra="$extra ?? null" />
    {{ $slot }}
    <x-footer />
</body>

</html>
