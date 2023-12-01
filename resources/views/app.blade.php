<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet"/>

    <!-- Favicons -->
    <link href="/favicon.ico" rel="icon"/>
    <link
        href="/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
    />
    <link
        href="/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
    />
    <link
        href="/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
    />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="h-full font-sans antialiased">
@inertia
</body>
</html>
