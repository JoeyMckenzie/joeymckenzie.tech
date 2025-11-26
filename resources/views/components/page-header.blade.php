@props(['title', 'description' => null, 'showSocialLinks' => true])

<header class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-4">
        <flux:heading size="xl" data-animation="slideUp">
            {{ $title }}
        </flux:heading>

        @if ($showSocialLinks)
            <x-social-links class="md:justify-end" />
        @endif
    </div>

    @if ($description)
        <flux:text class="mt-2" data-animation="slideUp" data-stagger="0.05">
            {{ $description }}
        </flux:text>
    @endif
</header>
