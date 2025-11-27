<?php

declare(strict_types=1);

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Date;
use Orbit\Concerns\Orbital;

/**
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property string $content
 * @property string $image
 * @property string|null $published_at
 * @property string $storage_key
 * @property int $tag_id
 * @property-read string $formatted_published_at
 * @property-read Tag $tag
 * @property-read string $to
 *
 * @method static Builder<static>|Post latestPublished()
 * @method static Builder<static>|Post newModelQuery()
 * @method static Builder<static>|Post newQuery()
 * @method static Builder<static>|Post published()
 * @method static Builder<static>|Post query()
 * @method static Builder<static>|Post whereContent($value)
 * @method static Builder<static>|Post whereDescription($value)
 * @method static Builder<static>|Post whereImage($value)
 * @method static Builder<static>|Post wherePublishedAt($value)
 * @method static Builder<static>|Post whereSlug($value)
 * @method static Builder<static>|Post whereStorageKey($value)
 * @method static Builder<static>|Post whereTagId($value)
 * @method static Builder<static>|Post whereTitle($value)
 *
 * @mixin Eloquent
 */
final class Post extends Model
{
    use Orbital;

    public static function schema(Blueprint $table): void
    {
        $table->string('title');
        $table->string('slug');
        $table->text('description');
        $table->text('content');
        $table->string('image');
        $table->date('published_at')->nullable();
        $table->string('storage_key');
        $table->foreignIdFor(Tag::class)->constrained();
    }

    /**
     * @return Attribute<non-falsy-string, never>
     */
    public function formattedPublishedAt(): Attribute
    {
        return Attribute::get(
            fn (): string => $this->published_at !== null
                ? Date::parse($this->published_at)->format('M d, Y')
                : Date::now()->format('M d, Y'),
        );
    }

    /**
     * @return Attribute<non-falsy-string, never>
     */
    public function to(): Attribute
    {
        return Attribute::get(
            fn (): string => "/blog/$this->slug"
        );
    }

    /**
     * @return BelongsTo<Tag, covariant $this>
     */
    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }

    /**
     * @param  Builder<Post>  $query
     * @return Builder<Post>
     */
    #[Scope]
    public function published(Builder $query): Builder
    {
        return $query->where('published_at', '!=', null);
    }

    /**
     * @param  Builder<Post>  $query
     * @return Builder<Post>
     */
    #[Scope]
    public function latestPublished(Builder $query): Builder
    {
        return app()->isProduction()
            ? $query->latest('published_at')
            : $query->orderByRaw('CASE WHEN published_at IS NULL THEN 0 ELSE 1 END DESC')
                ->orderByDesc('published_at');
    }

    public function getKeyName(): string
    {
        return 'storage_key';
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getIncrementing(): bool
    {
        return false;
    }

    public function usesTimestamps(): bool
    {
        return false;
    }
}
