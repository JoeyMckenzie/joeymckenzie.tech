<article
    class="prose mx-auto w-full overflow-hidden py-12 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md"
>
    <Meta
        name="description"
        content="{{ $post->description }}"
    />
    <Meta name="keywords" content="keywords" />
    <h1 class="text-center text-2xl font-semibold">
        {{ $post->title }}
    </h1>
    <div
        class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight"
    >
        <time datetime="datetime_date">{{ $post->displayDate() }}</time>
        <div class="badge badge-neutral">{{ $post->category }}</div>
        <p>{{ $post->formattedViews() }} views</p>
    </div>
    <img
        alt="{{ $post->title }} blog meme"
        src="{{ $post->hero_image }}"
        height="400"
        width="500"
    />
    {!! $post->parsed_content !!}
    <a wire:navigate.hover href="/blog" class="flex justify-center pt-8">
        <button class="btn">
            <span class="icon-[mdi--arrow-left] h-4 w-4"></span>
            Back to blog
        </button>
    </a>
</article>
