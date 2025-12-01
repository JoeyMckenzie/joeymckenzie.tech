<main class="w-full max-w-3xl px-4">
    <article class="flex flex-col gap-10">
        <header class="flex flex-col gap-4">
            <flux:heading size="xl" class="text-balance text-center">
                {{ $post->title }}
            </flux:heading>

            <div class="flex flex-row justify-center items-center gap-2">
                <flux:badge size="sm" class="lowercase tracking-wide text-xs">
                    {{ $post->tag->hashTagged }}
                </flux:badge>
                <flux:text variant="subtle">
                    {{ $post->formatted_published_at }}
                </flux:text>
            </div>
        </header>

        @if (filled($post->image))
            <figure class="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                <img src="{{ asset($post->image) }}" alt="{{ $post->title }} featured image"
                    class="object-cover w-full" loading="lazy">
            </figure>
        @endif

        <section class="prose dark:prose-invert space-y-6 text-base leading-7">
            {!! $content !!}
        </section>
    </article>
</main>
