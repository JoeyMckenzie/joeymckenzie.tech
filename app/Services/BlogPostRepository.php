<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ContentRepositoryContract;
use App\Models\BlogPost;
use DateInterval;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Override;

final readonly class BlogPostRepository implements ContentRepositoryContract
{
    #[Override]
    public function getBlogPostMetadata(): Collection
    {
        if (Cache::has('allPosts')) {
            /** @var Collection<int, BlogPost> $allPosts */
            $allPosts = Cache::get('allPosts');

            return $allPosts;
        }

        /** @var Collection<int, BlogPost> $posts */
        $posts = BlogPost::select([
            'slug',
            'published_date',
            'category',
            'description',
            'title',
            'views',
        ])
            ->orderByDesc('published_date')
            ->get();

        Cache::set('allPosts', $posts, new DateInterval('PT5M'));

        return $posts;
    }

    #[Override]
    public function getBlogPostBySlug(string $slug): BlogPost
    {
        // We won't cache the blogs, easier to let the view counts ride
        $post = BlogPost::select([
            'id',
            'slug',
            'keywords',
            'hero_image',
            'published_date',
            'category',
            'title',
            'views',
            'parsed_content',
        ])->firstWhere('slug', $slug);

        if (is_null($post)) {
            abort(404);
        }

        // While we're at it, add a view count
        // AddView::dispatch($post);

        $post->views += 1;
        $post->save();

        return $post;
    }

    #[Override]
    public function getLatestBlogPostMetadata(): Collection
    {
        if (Cache::has('latestPosts')) {
            /** @var Collection<int, BlogPost> $cachedPosts */
            $cachedPosts = Cache::get('latestPosts');

            return $cachedPosts;
        }

        /** @var Collection<int, BlogPost> $posts */
        $posts = BlogPost::select([
            'slug',
            'published_date',
            'category',
            'description',
            'title',
            'views',
        ])
            ->orderByDesc('published_date')
            ->limit(3)
            ->get();

        Cache::set('latestPosts', $posts, new DateInterval('PT5M'));

        return $posts;
    }
}
