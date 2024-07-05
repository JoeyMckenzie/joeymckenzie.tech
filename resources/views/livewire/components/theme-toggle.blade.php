<button wire:click="toggleTheme" type="button" class="flex items-center">
    @if ($prefersDark)
        <span class="icon-[ph--sun-fill] size-5 dark:text-neutral-300"></span>
    @else
        <span class="icon-[ph--moon-fill] size-5 dark:text-neutral-300"></span>
    @endif
</button>
