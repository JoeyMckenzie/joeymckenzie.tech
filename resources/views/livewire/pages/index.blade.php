<div class="mx-auto flex flex-col items-center py-12">
    <div class="prose">
        <h2
            class="text-center text-4xl font-extrabold tracking-tight sm:text-4xl"
        >
            Hi, I'm Joey.
        </h2>
        <p class="mx-auto mt-6 max-w-xl text-justify">
            I'm a software developer based in Northern California working in
            fintech. I enjoy writing about software, design, dad jokes, and
            cheap beer among a few other things. I like building fast, efficient
            web services, learning new things, and writing code in the open
            source ecosystem.
        </p>
    </div>
    <x-social-buttons />
    <div class="py-12">
        <h2
            class="pb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
            Latest thoughts.
        </h2>
        <x-blog-previews :posts="$posts" />
    </div>
    <x-notes />
</div>
