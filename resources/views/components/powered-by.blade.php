<div class="flex items-center justify-center space-x-3">
    <p class="my-auto text-xs">Powered by</p>
    @foreach ($providers as $provider)
        <a class="my-auto flex hover:underline" href="{{ $provider->href }}">
            <span class="sr-only">{{ $provider->display }}</span>
            @svg($provider->icon, 'h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110')
        </a>
    @endforeach

    <a class="text-xs hover:underline" href="{{ $commitLink }}" rel="noreferrer">
        {{ $commit }}
    </a>
</div>
