<x-layout title="Blog." subtitle="Adventures in code. Legacy nightmares. Bright shiny new frameworks.">
    <div style="padding-top: 2rem;">
        @if (count($postPreviews) > 1)
            @foreach ($postPreviews as $index => $preview)
                <small>
                    {{ $preview->post->display_date }}
                    <a
                        href="{{ route('blog.index', ['category' => $preview->post->category]) }}">{{ $preview->post->category }}</a>
                </small>
                <div style="padding-top: 1rem;">
                    <a href="{{ route('blog.show', ['slug' => $preview->post->slug]) }}"
                        data-pan="{{ sprintf('blog-page-link-%s', $preview->post->slug) }}">{{ $preview->post->title }}</a>
                    <br />
                    <small>{{ $preview->post->description }}</small>
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
