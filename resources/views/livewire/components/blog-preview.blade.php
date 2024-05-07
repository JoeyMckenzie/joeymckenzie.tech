<article
    class="hover:scale-102 flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1"
>
    <div class="flex items-center gap-x-2 text-xs">
        <time datetime="datetime_date">{{ $post->displayDate() }}</time>
        <div class="badge badge-neutral">{{ $post->category }}</div>
        <p>{{ $post->formattedViews() }} views</p>
    </div>
    <div class="group relative">
        <h3 class="mt-3 text-lg font-semibold leading-6">
            <a
                class="link-hover link"
                href="{{ $this->href() }}"
                wire:navigate
            >
                <span class="absolute inset-0"></span>
                {{ $post->title }}
            </a>
        </h3>
        <p class="mt-5 line-clamp-3 text-sm leading-6">
            {{ $post->description }}
        </p>
    </div>
</article>
