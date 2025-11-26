<main class="w-full max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
    <x-page-header title="Blog"
        description="Long-form thoughts on Laravel, PHP, and whatever else I'm tinkering with." />

    <x-preview-posts :posts="$posts" />
</main>
