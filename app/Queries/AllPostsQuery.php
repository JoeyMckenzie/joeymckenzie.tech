<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\Post;
use App\Queries\Contracts\Queryable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/**
 * @implements Queryable<Post>
 */
final class AllPostsQuery implements Queryable
{
    public function execute(?int $limit = null): Collection
    {
        return Post::query()
            ->with('tag:id,name')
            ->latest('published_at')
            ->when($limit !== null, function (Builder $query) use ($limit) {
                assert($limit !== null);
                $query->limit($limit); // @phpstan-ignore-line staticMethod.dynamicCall
            })
            ->get([
                'slug',
                'title',
                'description',
                'tag_id',
                'published_at',
                'storage_key',
            ]);
    }
}
