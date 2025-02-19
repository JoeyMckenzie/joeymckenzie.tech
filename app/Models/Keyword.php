<?php

declare(strict_types=1);

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $word
 * @property-read Collection<int, Post> $posts
 * @property-read int|null $posts_count
 *
 * @method static Builder<static>|Keyword newModelQuery()
 * @method static Builder<static>|Keyword newQuery()
 * @method static Builder<static>|Keyword query()
 * @method static Builder<static>|Keyword whereCreatedAt($value)
 * @method static Builder<static>|Keyword whereId($value)
 * @method static Builder<static>|Keyword whereUpdatedAt($value)
 * @method static Builder<static>|Keyword whereWord($value)
 *
 * @mixin Eloquent
 * @mixin IdeHelperKeyword
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
