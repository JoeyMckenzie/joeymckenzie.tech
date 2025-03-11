<x-layout title="{!! $post->title !!}" :subtitle="$post->display_date">
    <div id="blog-content" data-pan="{{ sprintf('blog-post-%s', $post->slug) }}" style="padding-top: 2rem;">
        <img style="margin-left: auto; margin-right: auto; width: 75%; display: block;" src="{{ $post->hero_image }}"
            height="400" width="400" alt="blog meme" />
        {!! $post->parsed_content !!}
    </div>
</x-layout>
