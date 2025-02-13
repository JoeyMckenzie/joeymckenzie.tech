<x-layout title="Blog." subtitle="Adventures in code. Legacy nightmares. Bright shiny new frameworks.">
    <div style="padding-top: 2rem;">
        @foreach ($posts as $index => $post)
            <small>
                {{ $post->display_date }}
                <a href="{{ route('blog.index', ['category' => $post->category]) }}">{{ $post->category }}</a>
            </small>
            <div style="padding-top: 1rem;">
                <a href="{{ route('blog.show', ['slug' => $post->slug]) }}">{{ $post->title }}</a>
                <p>{{ $post->description }}</p>
            </div>
            @if (!$loop->last)
                <hr />
            @endif
        @endforeach
    </div>
</x-layout>
