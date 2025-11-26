@props(['stagger' => 0.1])

<div {{ $attributes->class('flex items-center gap-1') }}>
    <flux:button class="hover:-translate-y-1 transition ease-in-out cursor-pointer" x-data
        x-on:click="$flux.dark = ! $flux.dark" icon="moon" variant="subtle" aria-label="Toggle dark mode"
        data-animation="slideUp" data-stagger="{{ $stagger }}" />

    <a href="https://x.com/_joeyMcKenzie" aria-label="Twitter/X Link">
        <flux:button class="hover:-translate-y-1 transition ease-in-out cursor-pointer" icon="twitter"
            variant="subtle" data-animation="slideUp" data-stagger="{{ $stagger }}" />
    </a>

    <a href="https://github.com/joeymckenzie" aria-label="GitHub Link">
        <flux:button class="hover:-translate-y-1 transition ease-in-out cursor-pointer" icon="github"
            variant="subtle" data-animation="slideUp" data-stagger="{{ $stagger }}" />
    </a>

    <a href="https://linkedin.com/in/joeymckenzie" aria-label="LinkedIn Link">
        <flux:button class="hover:-translate-y-1 transition ease-in-out cursor-pointer" icon="linkedin"
            variant="subtle" data-animation="slideUp" data-stagger="{{ $stagger }}" />
    </a>

    <a href="mailto:joey.mckenzie27@gmail.com" aria-label="Email Joey">
        <flux:button class="hover:-translate-y-1 transition ease-in-out cursor-pointer" icon="mail" variant="subtle"
            data-animation="slideUp" data-stagger="{{ $stagger }}" />
    </a>
</div>
