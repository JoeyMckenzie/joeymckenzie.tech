<button wire:click="toggleTheme" type="button" class="flex items-center">
    @if ($prefersDark)
        <span
            class="icon-[pixelarticons--sun] size-5 dark:text-neutral-300"
        ></span>
    @else
        <span
            class="icon-[pixelarticons--moon] size-5 dark:text-neutral-300"
        ></span>
    @endif
</button>
