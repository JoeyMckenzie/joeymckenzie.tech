<article
    class="hover:scale-102 flex max-w-md flex-col transition duration-150 ease-in-out hover:-translate-y-1"
>
    <x-link secondary href="{{ $this->href() }}" wire:navigate>
        <div class="flex w-full items-center gap-x-2 text-xs">
            <time datetime="datetime_date">{{ $this->displayDate() }}</time>
            <x-badge lime label="{{$post->category}}" />
            @if ($viewCountEnabled)
                <p>{{ $post->formattedViews() }} views</p>
            @endif
        </div>
        <div class="relative text-left">
            <h3 class="mt-3 text-lg font-semibold leading-6">
                {{ $post->title }}
            </h3>
            <p class="mt-5 line-clamp-3 text-sm leading-6">
                {{ $post->description }}
            </p>
        </div>
    </x-link>
</article>
