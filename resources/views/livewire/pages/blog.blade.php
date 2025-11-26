<main class="w-full max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
    <header class="space-y-4">
        <div class="flex flex-col">
            <div class="flex flex-wrap items-center justify-between">
                <flux:heading size="xl" data-animation="slideUp">
                    Blog
                </flux:heading>
                <x-social-links class="md:justify-end" />
            </div>
            <flux:text class="mt-2" data-animation="slideUp" data-stagger="0.05">
                Long-form thoughts on Laravel, PHP, and whatever else I'm tinkering with.
            </flux:text>
        </div>
    </header>

    <x-preview-posts :posts="$posts" />
</main>
