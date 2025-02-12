<x-layout title="Blog." subtitle="Adventures in code. Legacy nightmares. Bright shiny new frameworks.">
    <div style="padding-top: 2rem;">
        @foreach ($posts as $post)
            <div>
                <a href="{{ route('blog.show', ['slug' => $post->slug]) }}">{{ $post->title }}</a>
                <p>{{  $post->description }}</p>
            </div>
        @endforeach
    </div>
</x-layout>
