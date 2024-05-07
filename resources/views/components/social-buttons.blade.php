<div
    class="mx-auto grid max-w-2xl grid-cols-1 justify-center gap-x-4 gap-y-4 pt-8 sm:grid-cols-3"
>
    @foreach ($socialButtons as $socialButton)
        <a href="{{ $socialButton->href }}" class="btn">
            <span class="sr-only">{{ $socialButton->display }}</span>
            <span class="{{ "h-5 w-5 " . $socialButton->icon }}"></span>
            {{ $socialButton->display }}
            <span class="icon-[gridicons--external] h-5 w-5"></span>
        </a>
    @endforeach
</div>
