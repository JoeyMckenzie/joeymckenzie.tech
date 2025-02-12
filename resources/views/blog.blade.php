<x-layout title="Blog." subtitle="Adventures in code. Legacy nightmares. Bright shiny new frameworks.">
    <div style="padding-top: 2rem;">
        @foreach ($posts as $post)
            <small>{{ $post->display_date }}</small>
            <div>
                <a href="{{ route('blog.show', ['slug' => $post->slug]) }}">{{ $post->title }}</a>
                <p>{{ $post->description }}</p>
            </div>
            <hr/>
        @endforeach
    </div>
</x-layout>
