<x-layout title="Blog." subtitle="Adventures in code. Legacy nightmares. Bright shiny new frameworks.">
    <div style="padding-top: 2rem;">
        @if (count($posts) > 1)
            @foreach ($posts as $index => $post)
                <small>
                    {{ $post->display_date }}
                    <a href="{{ route('blog.index', ['category' => $post->category]) }}">{{ $post->category }}</a>
                </small>
                <div style="padding-top: 1rem;">
                    <a href="{{ route('blog.show', ['slug' => $post->slug]) }}"
                        data-pan="{{ sprintf('blog-page-link-%s', $post->slug) }}">{{ $post->title }}</a>
                    <p>{{ $post->description }}</p>
                </div>
                @if (!$loop->last)
                    <hr />
                @endif
            @endforeach
        @else
            <a href="{{ route('blog.index') }}">Back</a>
        @endif
    </div>
</x-layout>
