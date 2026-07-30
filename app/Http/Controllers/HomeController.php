<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Cache\CacheManager;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Renders the redesigned home page — the 3 most-recent published posts as
 * PostCards, cached ~5min so the landing page stays fast.
 */
final class HomeController extends Controller
{
    public function __construct(
        private readonly CacheManager $cache,
    ) {
        //
    }

    public function __invoke(): Response
    {
        $posts = $this->cache->remember(
            'home:recent_posts',
            now()->addMinutes(5),
            fn (): array => $this->recentPosts(),
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

    /**
     * Resolve a stored cover to a URL: object keys go through the image disk,
     * absolute URLs pass through, and an empty cover falls back to null.
     */
    private function coverUrl(string $image): ?string
    {
        if ($image === '') {
            return null;
        }

        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return $image;
        }

        return Storage::disk(Config::string('blog.image_disk'))->url($image);
    }
}
