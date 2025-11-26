@php
    use Illuminate\Support\Str;
@endphp

<main class="w-full max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
    <article class="flex flex-col gap-10">
        <header class="flex flex-col gap-4">
            <flux:heading size="xl" class="text-balance text-center">
                {{ $post->title }}
            </flux:heading>

            <div class="flex flex-row justify-center items-center gap-2">
                <flux:badge class="lowercase tracking-wide text-xs">
                    {{ $post->tag->name }}
                </flux:badge>
                <flux:text variant="subtle">
                    {{ $post->formatted_published_at }}
                </flux:text>
            </div>
        </header>

        @if (filled($post->image))
            <figure class="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
                <img src="{{ asset($post->image) }}" alt="{{ $post->title }} featured image"
                    class="object-cover w-full aspect-[16/9]" loading="lazy">
            </figure>
        @endif

        <section class="prose prose-invert space-y-6 text-base leading-7 text-zinc-700 dark:text-zinc-200">
            {!! $content !!}
        </section>
    </article>
</main>
