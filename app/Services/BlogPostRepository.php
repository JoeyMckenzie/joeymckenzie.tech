<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ContentRepositoryContract;
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
