<main class="w-full max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
    <x-home.header/>

    <div>
        <flux:heading size="xl" data-animation="slideUp" data-stagger="0.1">
            Recent Posts
        </flux:heading>
        <x-shared.preview-posts :posts="$posts"/>
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