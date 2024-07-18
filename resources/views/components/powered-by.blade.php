<div class="flex items-center justify-center space-x-3">
    <p class="my-auto text-center text-xs dark:text-neutral-300">Powered By</p>
    @foreach ($providers as $provider)
        <a href="{{ $provider->href }}" class="my-auto flex hover:underline">
            <span class="sr-only">{{ $provider->display }}</span>
            <span
                class="{{ $provider->icon }} h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            ></span>
        </a>
    @endforeach

    <a
        href="https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/{{ config("app.commit") }}"
        rel="noreferrer"
        class="text-xs hover:underline dark:text-neutral-300"
    >
        {{ substr(config("app.commit"), 0, 6) }}
    </a>
</div>
