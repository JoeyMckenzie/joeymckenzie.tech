<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\PostViewFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $post_id
 * @property string $ip_hash
 * @property string|null $referrer
 * @property string|null $user_agent
 * @property CarbonImmutable $viewed_at
 * @property-read Post $post
 *
 * @method static \Database\Factories\PostViewFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostView newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostView newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostView query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostView whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostView whereIpHash($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostView wherePostId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostView whereReferrer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostView whereUserAgent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostView whereViewedAt($value)
 *
 * @mixin \Eloquent
 */
#[Fillable(['post_id', 'ip_hash', 'referrer', 'user_agent', 'viewed_at'])]
#[WithoutTimestamps]
class PostView extends Model
{
    /**
     * @use HasFactory<PostViewFactory>
     */
    use HasFactory;

    /**
     * @return BelongsTo<Post, $this>
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'viewed_at' => 'datetime',
        ];
    }
}
