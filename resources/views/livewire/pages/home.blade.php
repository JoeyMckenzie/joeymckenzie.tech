<main class="w-full max-w-2xl px-6 py-12 lg:px-8 lg:py-16 space-y-12">
    <header class="space-y-4">
        <div class="flex flex-col">
            <div class="flex flex-wrap items-center justify-between">
                <flux:heading size="xl" data-animation="slideUp">
                    Hi, I'm Joey.
                </flux:heading>
                <x-social-links class="md:justify-end" />
            </div>
            <flux:text class="mt-2" data-animation="slideUp" data-stagger="0.05">
                Full-stack developer passionate about building scalable web applications with PHP and Laravel.
            </flux:text>
        </div>
    </header>

    <section class="space-y-6">
        <flux:heading size="xl" data-animation="slideUp" data-stagger="0.1">
            Recent Posts
        </flux:heading>

        <x-preview-posts :posts="$posts" />

        <div class="mt-12" data-animation="slideUp" data-stagger="0.2">
            <flux:link variant="subtle" href="{{ route('blog.index') }}" wire:navigate.hover>
                View all posts
            </flux:link>
        </div>
    </section>
</main>
