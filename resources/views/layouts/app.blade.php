<!DOCTYPE html>
<html lang="{{ str_replace("_", "-", app()->getLocale()) }}" class="h-full">
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
        <wireui:scripts />
        <script src="//unpkg.com/alpinejs" defer></script>
        @vite(["resources/css/app.css", "resources/js/app.js"])
    </head>
    <body class="h-full bg-white font-sans antialiased dark:bg-neutral-950">
        <main class="mx-auto min-h-screen max-w-2xl px-4 pt-8 sm:px-6 lg:px-8">
            <livewire:components.navbar />
            {{ $slot }}
            <x-footer />
        </main>

        <script>
            document.addEventListener('livewire:init', () => {
                Livewire.on('theme-toggled', ([$prefersDark]) => {
                    if ($prefersDark) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                });
            });
        </script>
    </body>
</html>
