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
        $blogPosts = BlogPost::all([
            'slug',
            'published_date',
            'category',
            'description',
            'title',
            'views',
        ]);

        return $blogPosts;
    }

    #[Override]
    public function getBlogPostBySlug(string $slug): BlogPost
    {
        $post = BlogPost::select([
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

        return $post;
    }
}
