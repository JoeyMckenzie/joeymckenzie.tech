<div class="flex items-center justify-center space-x-3">
    <p class="my-auto text-xs">Powered by</p>
    @foreach ($providers as $provider)
        <a href="{{ $provider->href }}" class="my-auto flex hover:underline">
            <span class="sr-only">{{ $provider->display }}</span>
            @svg($provider->icon, 'h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110')
        </a>
    @endforeach

    <a href="{{ $commitLink }}" rel="noreferrer" class="text-xs hover:underline">
        {{ $commit }}
    </a>
</div>
