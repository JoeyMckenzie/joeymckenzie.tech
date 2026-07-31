<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;

/**
 * @property int $id
 * @property int $tag_id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property string $content
 * @property string|null $content_html
 * @property string $image
 * @property int $reading_time_minutes
 * @property CarbonImmutable|null $published_at
 * @property int $views_count
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read string $formatted_published_at
 * @property-read Collection<int, PostReaction> $reactions
 * @property-read int|null $reactions_count
 * @property-read Tag $tag
 * @property-read Collection<int, PostView> $views
 *
 * @method static \Database\Factories\PostFactory factory($count = null, $state = [])
 * @method static Builder<static>|Post newModelQuery()
 * @method static Builder<static>|Post newQuery()
 * @method static Builder<static>|Post published()
 * @method static Builder<static>|Post query()
 * @method static Builder<static>|Post whereContent($value)
 * @method static Builder<static>|Post whereContentHtml($value)
 * @method static Builder<static>|Post whereCreatedAt($value)
 * @method static Builder<static>|Post whereDescription($value)
 * @method static Builder<static>|Post whereId($value)
 * @method static Builder<static>|Post whereImage($value)
 * @method static Builder<static>|Post wherePublishedAt($value)
 * @method static Builder<static>|Post whereReadingTimeMinutes($value)
 * @method static Builder<static>|Post whereSlug($value)
 * @method static Builder<static>|Post whereTagId($value)
 * @method static Builder<static>|Post whereTitle($value)
 * @method static Builder<static>|Post whereUpdatedAt($value)
 * @method static Builder<static>|Post whereViewsCount($value)
 *
 * @mixin \Eloquent
 */
#[Fillable([
    'tag_id',
    'title',
    'slug',
    'description',
    'content',
    'content_html',
    'image',
    'reading_time_minutes',
    'published_at',
    'views_count',
])]
#[Appends(['formatted_published_at'])]
class Post extends Model
{
    /**
     * @use HasFactory<PostFactory>
     */
    use HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'views_count' => 0,
    ];

    /**
     * @return BelongsTo<Tag, $this>
     */
    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }

    /**
     * @return HasMany<PostView, $this>
     */
    public function views(): HasMany
    {
        return $this->hasMany(PostView::class);
    }

    /**
     * @return HasMany<PostReaction, $this>
     */
    public function reactions(): HasMany
    {
        return $this->hasMany(PostReaction::class);
    }

    #[\Override]
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    #[\Override]
    protected static function booted(): void
    {
        static::addGlobalScope('visibleToGuest', static function (Builder $query): void {
            if (Auth::guest()) {
                $query
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
            }
        });
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
     * @param  Builder<Post>  $query
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'reading_time_minutes' => 'integer',
            'views_count' => 'integer',
        ];
    }
}
