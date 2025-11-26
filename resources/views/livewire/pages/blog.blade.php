<main class="w-full max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
    <div class="mb-12">
        <flux:heading size="xl" data-animation="slideUp">
            All Posts
        </flux:heading>
        <flux:text class="mt-4" data-animation="slideUp" data-stagger="0.1">
            Long-form thoughts on Laravel, PHP, and whatever else I'm tinkering with.
        </flux:text>
    </div>

    <x-preview-posts :posts="$posts" />
</main>
