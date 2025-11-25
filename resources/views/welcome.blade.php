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
        <div class="flex items-center justify-center w-full min-h-screen">
            <main class="w-full max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
                <!-- Header / Hero Section -->
                <div class="mb-16 lg:mb-24">
                    <flux:heading size="xl" data-animation="slideUp">
                        Hi, I'm Joey.
                    </flux:heading>
                    <flux:subheading data-animation="slideUp" data-stagger="0.1">
                        Full-stack developer passionate about building scalable web applications with Laravel and Livewire. Sharing thoughts on tech, code, and the web.
                    </flux:subheading>
                    <flux:button x-data x-on:click="$flux.dark = ! $flux.dark" icon="moon" variant="subtle" aria-label="Toggle dark mode" />
                </div>

                <!-- Recent Posts Section -->
                <div>
                    <h2 class="text-2xl lg:text-3xl font-semibold mb-8" data-animation="slideUp" data-stagger="0.2">
                        Recent Posts
                    </h2>

                    <!-- Posts Grid -->
                    <div class="space-y-6 lg:space-y-8">
                        <!-- Post 1 -->
                        <article class="border-b border-[#e3e3e0] dark:border-[#3E3E3A] pb-8" data-animation="slideUp" data-stagger="0.08">
                            <time class="text-sm text-[#706f6c] dark:text-[#A1A09A]">November 24, 2025</time>
                            <h3 class="text-xl lg:text-2xl font-semibold mt-3 mb-3 hover:text-[#f53003] dark:hover:text-[#FF4433] transition-colors cursor-pointer">
                                Getting Started with Livewire 3
                            </h3>
                            <p class="text-[#706f6c] dark:text-[#A1A09A] line-clamp-2">
                                A comprehensive guide to building reactive components with Livewire 3 and Flux UI. Learn about wire:model, lifecycle hooks, and real-time validation.
                            </p>
                        </article>

                        <!-- Post 2 -->
                        <article class="border-b border-[#e3e3e0] dark:border-[#3E3E3A] pb-8" data-animation="slideUp" data-stagger="0.08">
                            <time class="text-sm text-[#706f6c] dark:text-[#A1A09A]">November 18, 2025</time>
                            <h3 class="text-xl lg:text-2xl font-semibold mt-3 mb-3 hover:text-[#f53003] dark:hover:text-[#FF4433] transition-colors cursor-pointer">
                                Tailwind CSS v4: What's New?
                            </h3>
                            <p class="text-[#706f6c] dark:text-[#A1A09A] line-clamp-2">
                                Exploring the new CSS-first approach in Tailwind v4, theme customization without config files, and modern syntax improvements.
                            </p>
                        </article>

                        <!-- Post 3 -->
                        <article class="border-b border-[#e3e3e0] dark:border-[#3E3E3A] pb-8" data-animation="slideUp" data-stagger="0.08">
                            <time class="text-sm text-[#706f6c] dark:text-[#A1A09A]">November 12, 2025</time>
                            <h3 class="text-xl lg:text-2xl font-semibold mt-3 mb-3 hover:text-[#f53003] dark:hover:text-[#FF4433] transition-colors cursor-pointer">
                                Building Dark Mode with Tailwind
                            </h3>
                            <p class="text-[#706f6c] dark:text-[#A1A09A] line-clamp-2">
                                A deep dive into implementing dark mode using Tailwind's dark variant, system preferences, and user-controlled toggles.
                            </p>
                        </article>
                    </div>

                    <!-- View All Link -->
                    <div class="mt-12" data-animation="slideUp" data-stagger="0.3">
                        <a href="#" class="inline-flex items-center gap-2 font-medium text-[#f53003] dark:text-[#FF4433] hover:underline">
                            View all posts
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                                <path d="M11.6 8L6.8 3.2M11.6 8L6.8 12.8" stroke="currentColor" stroke-linecap="square" stroke-width="1.5"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </main>
        </div>
        @fluxScripts
    </body>
</html>
