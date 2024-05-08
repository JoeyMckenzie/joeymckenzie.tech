<!DOCTYPE html>
<html
    data-theme="forest"
    lang="{{ str_replace("_", "-", app()->getLocale()) }}"
    class="h-full"
>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="csrf-token" content="{{ csrf_token() }}" />

        <title>{{ "$title | joeymckenzie.tech" }}</title>

        <!-- Favicons -->
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        <!-- Scripts -->
        @vite(["resources/css/app.css", "resources/js/app.js"])
    </head>
    <body class="h-full font-sans antialiased">
        <main
            class="mx-auto min-h-screen max-w-screen-xl px-4 pt-8 sm:px-6 lg:px-8"
        >
            <livewire:components.navbar />
            {{ $slot }}
            <x-footer />
        </main>

        <script>
            document.addEventListener('livewire:init', () => {
                Livewire.on('theme-toggled', ([prefersDark]) => {
                    const theme = prefersDark ? 'forest' : 'light';
                    document.documentElement.setAttribute('data-theme', theme);
                });
            });
        </script>
    </body>
</html>
