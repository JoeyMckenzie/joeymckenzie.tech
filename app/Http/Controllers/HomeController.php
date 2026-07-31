<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasCoverUrl;
use App\Models\Post;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

final class HomeController extends Controller
{
    use HasCoverUrl;

    public function __invoke(): Response
    {
        $posts = Cache::remember(
            'home:recent_posts',
            now()->addMinutes(5),
            $this->recentPosts(...),
        );

        return Inertia::render('home', [
            'posts' => $posts,
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function recentPosts(): array
    {
        return Post::query()
            ->select([
                'id',
                'tag_id',
                'slug',
                'title',
                'description',
                'image',
                'reading_time_minutes',
                'published_at',
                'views_count',
            ])
            ->published()
            ->with('tag:id,name')
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(fn (Post $post): array => [
                'title' => $post->title,
                'slug' => $post->slug,
                'description' => $post->description,
                'tag' => $post->tag->name,
                'cover' => $this->coverUrl($post->image),
                'publishedAt' => $post->published_at?->toDateString() ?? '',
                'publishedLabel' => $post->formatted_published_at,
                'readingMinutes' => $post->reading_time_minutes,
                'views' => $post->views_count,
            ])
            ->values()
            ->all();
    }
}
