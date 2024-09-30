<?php

declare(strict_types=1);

use App\Models\Post;
use Illuminate\View\View;

use function Laravel\Folio\render;

render(function (View $view) {
    $posts = Post::select(['slug', 'title', 'category', 'description', 'published_date', 'views'])
        ->orderByDesc('published_date')
        ->get();

    return $view->with('posts', $posts);
}); ?>

@section('title')
    Blog
@endsection

<x-app-layout>
    <div class="hero">
        <div class="hero-content flex flex-col">
            <div class="max-w-md prose">
                <h1 class="text-xl font-bold text-center">Blog.</h1>
                <p>
                    I write about a lot of things, mainly languages, ecosystems, and software design. I consider my
                    writing a journal of technologies I've worked with at some point during my career, and I'm always
                    happy to field questions and conversations from interested readers.
                </p>
            </div>
            <div class="py-12 mx-auto grid max-w-4xl grid-cols-1 gap-x-2 gap-y-12 sm:grid-cols-3">
                @foreach ($posts as $post)
                    <article
                        class="hover:scale-102 flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1">
                        <div class="flex items-center gap-x-2 text-xs">
                            <time datetime="datetime_date">{{ $post->display_date }}</time>
                            <div class="badge badge-primary">{{ $post->category }}</div>
                        </div>
                        <div class="group relative">
                            <h3 class="mt-3 text-lg font-semibold leading-6">
                                <a class="link-hover link" href={{ "/blog/$post->slug" }}>
                                    <span class="absolute inset-0"></span>
                                    {{ $post->title }}
                                </a>
                            </h3>
                            <p class="mt-5 line-clamp-3 text-sm leading-6">
                                {{ $post->description }}
                            </p>
                        </div>
                    </article>
                @endforeach
            </div>
        </div>
    </div>
</x-app-layout>
