<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\Post;
use App\ValueObjects\ContentMeta;
use Illuminate\Database\Eloquent\Collection;

interface ContentRepositoryContract
{
    /**
     * @return Collection<int, Post>
     */
    public function getBlogPostMetadata(): Collection;

    /**
     * @return Collection<int, Post>
     */
    public function getLatestBlogPostMetadata(): Collection;

    public function getBlogPostBySlug(string $slug): Post;

    public function upsertBlogPost(ContentMeta $contentMeta): Post;
}
