<button wire:click="toggleTheme" type="button" class="flex items-center">
    @if ($prefersDark)
        <span
            class="icon-[pixelarticons--sun] swap-off h-5 w-5 fill-current"
        ></span>
    @else
        <span
            class="icon-[pixelarticons--moon] swap-off h-5 w-5 fill-current"
        ></span>
    @endif
</button>
