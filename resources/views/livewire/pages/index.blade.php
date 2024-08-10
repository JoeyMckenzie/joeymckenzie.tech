<div class="prose mx-auto py-12 dark:prose-invert">
    <h2 class="text-4xl font-extrabold tracking-tight sm:text-4xl">
        Hi, I'm Joey.
    </h2>
    <p class="mx-auto">
        I'm a software developer based in Northern California working in
        fintech. I enjoy writing about software, design, dad jokes, and cheap
        beer among a few other things. I like building fast, efficient web
        services, learning new things, and writing code in the open source
        ecosystem.
    </p>
    <x-social-buttons />
    <x-blog-previews :posts="$posts" />
    <a class="flex justify-center py-12" wire:navigate href="/blog">
        <x-button lime>
            Blog
            <span class="icon-[gridicons--external] h-5 w-5"></span>
        </x-button>
    </a>
</div>
