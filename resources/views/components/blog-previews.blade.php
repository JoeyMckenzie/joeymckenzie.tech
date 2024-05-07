<div
    class="mx-auto grid max-w-4xl grid-cols-1 gap-x-2 gap-y-12 pt-12 sm:grid-cols-3"
>
    @foreach ($posts as $post)
        <livewire:components.blog-preview :post="$post" />
    @endforeach
</div>
