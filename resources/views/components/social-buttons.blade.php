<div
    class="mx-auto grid w-full max-w-xl grid-cols-1 justify-center gap-4 pt-8 sm:grid-cols-3"
>
    @foreach ($socialButtons as $socialButton)
        <a href="{{ $socialButton->href }}">
            <x-button lime class="w-full">
                <span class="sr-only">{{ $socialButton->display }}</span>
                <span class="{{ "h-5 w-5 " . $socialButton->icon }}"></span>
                {{ $socialButton->display }}
                <span class="icon-[gridicons--external] h-5 w-5"></span>
            </x-button>
        </a>
    @endforeach
</div>
