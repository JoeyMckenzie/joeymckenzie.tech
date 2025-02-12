<x-layout title="{{ $post->title }}" subtitle="{!! $post->description !!}">
    <div style="padding-top: 2rem;">
        {!! $post->parsed_content !!}
    </div>
</x-layout>
