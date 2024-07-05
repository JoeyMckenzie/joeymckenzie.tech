<div class="flex items-center justify-between">
    <div class="flex items-center justify-center text-sm">
        <a
            wire:navigate
            href="/"
            class="{{ $this->getClassnameForLink("home") }}"
        >
            Home
        </a>
        <span
            class="icon-[fluent--slash-forward-12-regular] text-neutral-500"
        ></span>
        <a
            wire:navigate
            href="/now"
            class="{{ $this->getClassnameForLink("now") }}"
        >
            Now
        </a>
        <span
            class="icon-[fluent--slash-forward-12-regular] text-neutral-500"
        ></span>
        <a
            wire:navigate
            href="/blog"
            class="{{ $this->getClassnameForLink("blog") }}"
        >
            Blog
        </a>
    </div>
    <livewire:components.theme-toggle />
</div>
