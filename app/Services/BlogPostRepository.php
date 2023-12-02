<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ContentRepositoryContract;
use App\Jobs\AddView;
use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Collection;
use Override;

final readonly class BlogPostRepository implements ContentRepositoryContract
{
    #[Override]
    public function getBlogPostMetadata(): Collection
    {
        /**
         * @return Collection<int, BlogPost>
         */
        return BlogPost::select([
            'slug',
            'published_date',
            'category',
            'description',
            'title',
            'views',
        ])
            ->orderByDesc('published_date')
            ->get();
    }

    #[Override]
    public function getBlogPostBySlug(string $slug): BlogPost
    {
        $post = BlogPost::select([
            'slug',
            'keywords',
            'hero_image',
            'published_date',
            'category',
            'title',
            'views',
            'parsed_content',
        ])->firstWhere('slug', $slug);

        if (! $post?->exists()) {
            abort(404);
        }

        // While we're add it, add a view count
        AddView::dispatch($post->slug, $post->views);

        return $post;
    }

    #[Override]
    public function getLatestBlogPostMetadata(): Collection
    {
        /**
         * @return Collection<int, BlogPost>
         */
        return BlogPost::select([
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
    }
}
