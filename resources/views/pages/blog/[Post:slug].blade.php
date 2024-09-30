<?php

declare(strict_types=1);

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\View\View;

use function Laravel\Folio\render;

render(function (View $view, Request $request, Post $post): \Illuminate\View\View {
    // We only want legit views from users, not bots so check the
    // user-agent to see if it contains a known bot crawler
    $userAgent = $request->headers->get('user-agent') ?? '';
    $botPatterns = [
        '/googlebot/i', // Google's web crawler
        '/bingbot/i', // Microsoft's Bing bot
        '/slurp/i', // Yahoo's search engine bot
        '/duckduckbot/i', // DuckDuckGo's bot
        '/baiduspider/i', // Baidu's bot
        '/yandexbot/i', // Yandex's bot
    ];

    $matchedUserAgentBot = collect($botPatterns)->first(fn (string $pattern): bool => preg_match($pattern, $userAgent) === 1);

    // If a bot was detected, we won't increment the view count - I mean come on, I'm not that _that_ popular...
    if ($matchedUserAgentBot === null) {
        $post->views += 1;
        $post->save();
    }

    return $view;
}); ?>

@section('meta')
    <meta name="description" content="{{ $post->description }}" />
@endsection

@section('title')
    {{ $post->title }}
@endsection

<x-app-layout>

    <article
        class="prose mx-auto w-full overflow-hidden py-12 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md">
        <h1 class="text-center text-2xl font-semibold">
            {{ $post->title }}
        </h1>
        <div class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight">
            <time datetime="{{ $post->display_date }}">{{ $post->display_date }}</time>
            <div class="badge badge-neutral">{{ $post->category }}</div>
            <p>{{ $post->formatted_views }} views</p>
        </div>
        <img alt="{{ $post->title }} blog meme" src="{{ $post->hero_image }}" height="400" width="500" />
        {!! $post->parsed_content !!}
        <a href="/blog" class="flex justify-center pt-8">
            <button class="btn">
                Back to blog
            </button>
        </a>
    </article>

</x-app-layout>
