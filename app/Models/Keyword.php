<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $word
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Post> $posts
 * @property-read int|null $posts_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keyword newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keyword newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keyword query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keyword whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keyword whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keyword whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keyword whereWord($value)
 *
 * @mixin \Eloquent
 */
final class Keyword extends Model
{
    /**
     * @return BelongsToMany<Post, covariant $this>
     */
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }
}
