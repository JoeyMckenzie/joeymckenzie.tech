<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Collection;

interface ContentRepositoryContract
{
    /**
     * @return Collection<int, BlogPost>
     */
    public function getBlogPostMetadata(): Collection;

    /**
     * @return Collection<int, BlogPost>
     */
    public function getLatestBlogPostMetadata(): Collection;

    public function getBlogPostBySlug(string $slug): BlogPost;
}
