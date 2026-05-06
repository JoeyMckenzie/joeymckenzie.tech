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
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Date;
use Orbit\Concerns\Orbital;
use Override;

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
 * @property-read int $reading_time_minutes
 * @property-read Tag $tag
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

    /**
     * @var list<string>
     */
    protected $appends = [
        'formatted_published_at',
        'reading_time_minutes',
    ];

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
     * @return BelongsTo<Tag, $this>
     */
    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }

    #[Override]
    public function getKeyName(): string
    {
        return 'storage_key';
    }

    #[Override]
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    #[Override]
    public function getIncrementing(): bool
    {
        return false;
    }

    #[Override]
    public function usesTimestamps(): bool
    {
        return false;
    }

    #[Override]
    protected static function booted(): void
    {
        if (App::isProduction()) {
            self::addGlobalScope('published', static fn (Builder $query) => $query->whereNotNull('published_at'));
        }
    }

    /**
     * @return Attribute<non-falsy-string, never>
     */
    protected function formattedPublishedAt(): Attribute
    {
        return Attribute::get(fn (): string => $this->published_at !== null
            ? Date::parse($this->published_at)->format('M d, Y')
            : Date::now()->format('M d, Y'));
    }

    /**
     * @return Attribute<int<1, max>, never>
     */
    protected function readingTimeMinutes(): Attribute
    {
        return Attribute::get(fn (): int => max(1, (int) ceil(str_word_count(strip_tags($this->content ?? '')) / 200)));
    }

    /**
     * @param  Builder<Post>  $query
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query->whereNotNull('published_at');
    }

    /**
     * @param  Builder<Post>  $query
     * @return Builder<Post>
     */
    #[Scope]
    protected function latestPublished(Builder $query): Builder
    {
        return App::isProduction()
            ? $query->latest('published_at')
            : $query->orderByRaw('CASE WHEN published_at IS NULL THEN 1 ELSE 0 END DESC')->orderByDesc('published_at');
    }
}
