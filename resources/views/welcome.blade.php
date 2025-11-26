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
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet"/>

    <!-- Styles / Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @fluxAppearance
</head>
<body class="min-h-screen">
<div class="flex items-center justify-center w-full min-h-screen">
    <main class="w-full max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
        <!-- Header / Hero Section -->
        <div class="mb-16 lg:mb-24">
            <div class="flex flex-row justify-between">
                <flux:heading size="xl" data-animation="slideUp">
                    Hi, I'm Joey.
                </flux:heading>
                <div class="flex flex-row items-center">
                    <flux:button class="hover:-translate-y-1 transition ease-in-out" x-data x-on:click="$flux.dark = ! $flux.dark" icon="moon" variant="subtle" aria-label="Toggle dark mode" data-animation="slideUp" data-stagger="0.1"/>
                    <flux:button class="hover:-translate-y-1 transition ease-in-out" icon="twitter" variant="subtle" aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1"/>
                    <flux:button class="hover:-translate-y-1 transition ease-in-out" icon="github" variant="subtle" aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1"/>
                    <flux:button class="hover:-translate-y-1 transition ease-in-out" icon="linkedin" variant="subtle" aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1"/>
                    <flux:button class="hover:-translate-y-1 transition ease-in-out" icon="mail" variant="subtle" aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1"/>
                </div>
            </div>
            <flux:text data-animation="slideUp" data-stagger="0.15">
                Full-stack developer passionate about building scalable web applications with PHP and Laravel.
            </flux:text>
        </div>

        <!-- Recent Posts Section -->
        <div>
            <flux:heading size="xl" data-animation="slideUp" data-stagger="0.2">
                Recent Posts
            </flux:heading>

            <!-- Posts Grid -->
            <div class="flex flex-col gap-4 mt-4">
                <!-- Post 1 -->
                <article class="group flex flex-col gap-2" data-animation="slideUp"
                         data-stagger="0.08">
                    <a href="#" wire:navigate>
                        <flux:text variant="subtle">November 24, 2025</flux:text>
                        <flux:heading size="lg" class="font-semibold group-hover:text-accent transition-colors">
                            Getting Started with Livewire 3
                        </flux:heading>
                        <flux:text class="mt-1">
                            A comprehensive guide to building reactive components with Livewire 3 and Flux UI. Learn
                            about wire:model, lifecycle hooks, and real-time validation.
                        </flux:text>
                    </a>
                </article>
                <!-- Post 1 -->
                <article class="group flex flex-col gap-2" data-animation="slideUp"
                         data-stagger="0.08">
                    <a href="#" wire:navigate>
                        <flux:text variant="subtle">November 24, 2025</flux:text>
                        <flux:heading size="lg" class="font-semibold group-hover:text-accent transition-colors">
                            Getting Started with Livewire 3
                        </flux:heading>
                        <flux:text class="mt-1">
                            A comprehensive guide to building reactive components with Livewire 3 and Flux UI. Learn
                            about wire:model, lifecycle hooks, and real-time validation.
                        </flux:text>
                    </a>
                </article>
            </div>

            <!-- View All Link -->
            <div class="mt-12" data-animation="slideUp" data-stagger="0.2">
                <a href="#" class="inline-flex items-center gap-2 font-medium hover:underline">
                    View all posts
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                         class="w-4 h-4">
                        <path d="M11.6 8L6.8 3.2M11.6 8L6.8 12.8" stroke="currentColor" stroke-linecap="square"
                              stroke-width="1.5"/>
                    </svg>
                </a>
            </div>
        </div>
    </main>
</div>
@fluxScripts
</body>
</html>
