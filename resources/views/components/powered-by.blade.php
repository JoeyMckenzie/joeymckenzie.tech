<div class="flex items-center justify-center space-x-3">
    <p class="my-auto text-xs">Powered by</p>
    @foreach ($providers as $provider)
        <a href="{{ $provider->href }}" class="my-auto flex hover:underline">
            <span class="sr-only">{{ $provider->display }}</span>
            <span
                class="{{ "h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 " . $provider->icon }}"
            ></span>
        </a>
    @endforeach

    <div class="my-auto flex">
        <livewire:components.theme-toggle />
    </div>

    <a
        href="{{ "https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/" . config("app.commit") }}"
        rel="noreferrer"
        class="text-xs hover:underline"
    >
        {{ substr(config("app.commit"), 0, 6) }}
    </a>
</div>
