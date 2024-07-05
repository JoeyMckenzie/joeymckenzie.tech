<div class="flex items-center justify-center space-x-4">
    @foreach ($socialIcons as $socialIcon)
        <a
            href="{{ $socialIcon->href }}"
            class="my-auto flex hover:underline dark:text-neutral-300"
        >
            <span class="sr-only dark:text-neutral-300">
                {{ $socialIcon->display }}
            </span>
            <span
                class="{{ $socialIcon->icon }} h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            ></span>
        </a>
    @endforeach
</div>
