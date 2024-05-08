<div class="flex items-center justify-center space-x-4">
    @foreach ($socialIcons as $socialIcon)
        <a href="{{ $socialIcon->href }}" class="my-auto flex hover:underline">
            <span class="sr-only">{{ $socialIcon->display }}</span>
            <span
                class="{{ "h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 " . $socialIcon->icon }}"
            ></span>
        </a>
    @endforeach

    <div
        class="hover:scale-102 my-auto flex h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1"
    >
        <livewire:components.theme-toggle />
    </div>
</div>
