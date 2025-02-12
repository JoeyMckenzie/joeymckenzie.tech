<x-layout title="{!! $post->title !!}" :subtitle="$post->display_date">
    <div style="padding-top: 2rem;">
        <img style="margin-left: auto; margin-right: auto; width: 75%; display: block;"
             src="{{$post->hero_image}}"
             alt="blog meme"
        />
        {!! $post->parsed_content !!}
    </div>
</x-layout>
