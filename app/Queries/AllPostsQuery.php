<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\Post;
use App\Queries\Contracts\Queryable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * @implements Queryable<Post>
 */
final class AllPostsQuery implements Queryable
{
    public function execute(?int $limit = null): Collection
    {
        $cacheKey = sprintf('posts:%s', $limit ?? 'all');
        $resolver = fn () => Post::query() // @phpstan-ignore-line method.nonObject
            ->with('tag:id,name')
            ->when(app()->isProduction(), function (Builder $query) {
                $query->published();
            })
            ->when($limit !== null, function (Builder $query) use ($limit) {
                assert($limit !== null);
                $query->limit($limit); // @phpstan-ignore-line staticMethod.dynamicCall
            })
            ->latestPublished()
            ->get([
                'slug',
                'title',
                'description',
                'tag_id',
                'published_at',
                'storage_key',
            ]);

        /** @var Collection<int, Post> $results */
        $results = app()->isProduction()
            ? Cache::remember($cacheKey, now()->addMinutes(5), $resolver)
            : $resolver();

        return $results;
    }
}
