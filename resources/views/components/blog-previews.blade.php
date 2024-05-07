<div
    class="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 py-12 sm:grid-cols-3"
>
    @foreach ($posts as $post)
        <livewire:components.blog-preview :post="$post" />
    @endforeach
</div>
