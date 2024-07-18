<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Contracts\ContentUtilityContract;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Livewire\Component;

final class BlogPost extends Component
{
    public ?Post $post = null;

    public function mount(string $slug, Request $request, ContentUtilityContract $contentUtility): void
    {
        $post = Post::query()
            ->with('keywords')
            ->select([
                'id',
                'slug',
                'hero_image',
                'published_date',
                'category',
                'title',
                'parsed_content',
                'views',
            ])->firstWhere('slug', $slug);

        if ($post === null) {
            abort(404);
        }

        /** @var bool $viewCountEnabled */
        $viewCountEnabled = config('app.view_count_enabled');

        if ($viewCountEnabled) {
            // We only want legit views from users, not bots so check the
            // user-agent to see if it contains a known bot crawler
            $userAgent = $request->headers->get('user-agent') ?? '';
            $botPatterns = [
                '/googlebot/i', // Google's web crawler
                '/bingbot/i',   // Microsoft's Bing bot
                '/slurp/i',     // Yahoo's search engine bot
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
        }

        $this->post = $post;
    }

    public function render(): View
    {
        return view('livewire.pages.blog-post')
            ->title($this->post?->title);
    }
}
