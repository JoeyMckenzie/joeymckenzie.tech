<?php

declare(strict_types=1);

namespace App\ValueObjects;

use App\Models\PanAnalytic;
use App\Models\Post;
use Illuminate\Database\Eloquent\Collection;

final readonly class PostPreview
{
    private function __construct(
        public Post $post,
        public int $impressions
    ) {
        //
    }

    /**
     * @param  Collection<int, PanAnalytic>  $analytics
     */
    public static function from(Post $post, Collection $analytics): self
    {
        $impressions = $analytics
            ->first(fn (PanAnalytic $analytic): bool => $analytic->name === "blog-post-$post->slug")
            ->impressions ?? 0;

        return new self($post, $impressions);
    }
}
