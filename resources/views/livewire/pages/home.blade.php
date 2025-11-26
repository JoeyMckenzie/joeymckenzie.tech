<main class="w-full max-w-2xl px-6 py-12 lg:px-8 lg:py-16 space-y-12">
    <x-page-header title="Hi, I'm Joey."
        description="Full-stack developer passionate about building scalable web applications with PHP and Laravel." />

    <section class="space-y-6">
        <flux:heading size="xl" data-animation="slideUp" data-stagger="0.1">
            Recent Posts
        </flux:heading>

        <x-preview-posts :posts="$posts" />

        <div class="mt-4" data-animation="slideUp" data-stagger="0.15">
            <flux:link variant="subtle" href="{{ route('blog.index') }}" class="flex flex-row items-center gap-1">
                More
            </flux:link>
        </div>
    </section>
</main>
