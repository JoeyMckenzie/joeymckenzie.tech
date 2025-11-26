<div class="flex flex-col gap-4 mt-4">
    @foreach ($posts as $post)
        <article class="group flex flex-col gap-2" data-animation="slideUp" data-stagger="0.15">
            <a href="{{ $post->to }}" wire:navigate.hover>
                <flux:text variant="subtle">{{ $post->formatted_published_at }}</flux:text>
                <flux:heading size="lg" class="group-hover:text-zinc-200/50 transition-colors">
                    {{ $post->title }}
                </flux:heading>
                <flux:text class="mt-1">
                    {{ $post->description }}
                </flux:text>
            </a>
        </article>
    @endforeach
</div>
