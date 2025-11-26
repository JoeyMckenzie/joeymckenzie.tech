<main class="w-full max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
    <div class="mb-16 lg:mb-24">
        <div class="flex flex-row justify-between">
            <flux:heading size="xl" data-animation="slideUp">
                Hi, I'm Joey.
            </flux:heading>
            <div class="flex flex-row items-center">
                <flux:button class="hover:-translate-y-1 transition ease-in-out cursor-pointer" x-data
                    x-on:click="$flux.dark = ! $flux.dark" icon="moon" variant="subtle" aria-label="Toggle dark mode"
                    data-animation="slideUp" data-stagger="0.1" />
                <a href="https://x.com/_joeyMcKenzie">
                    <flux:button class="hover:-translate-y-1 transition ease-in-out cursor-pointer" icon="twitter"
                        variant="subtle" aria-label="Twitter/X Link" data-animation="slideUp" data-stagger="0.1" />
                </a>
                <a href="https://github.com/joeymckenzie">
                    <flux:button class="hover:-translate-y-1 transition ease-in-out cursor-pointer" icon="github"
                        variant="subtle" aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1" />
                </a>
                <a href="https://linkedin.com/in/joeymckenzie">
                    <flux:button class="hover:-translate-y-1 transition ease-in-out cursor-pointer" icon="linkedin"
                        variant="subtle" aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1" />
                </a>
                <a href="mailto:joey.mckenzie27@gmail.com">
                    <flux:button class="hover:-translate-y-1 transition ease-in-out cursor-pointer" icon="mail"
                        variant="subtle" aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1" />
                </a>
            </div>
        </div>
        <flux:text data-animation="slideUp" data-stagger="0.15">
            Full-stack developer passionate about building scalable web applications with PHP and Laravel.
        </flux:text>
    </div>

    <div>
        <flux:heading size="xl" data-animation="slideUp" data-stagger="0.1">
            Recent Posts
        </flux:heading>

        <x-preview-posts :posts="$posts" />

        <div class="mt-12" data-animation="slideUp" data-stagger="0.2">
            <flux:link variant="subtle" href="{{ route('blog.index') }}" wire:navigate.hover>
                View all posts
            </flux:link>
        </div>
    </div>
</main>
