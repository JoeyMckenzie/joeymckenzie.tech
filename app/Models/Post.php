<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Eloquent;
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
 * @property int $tag_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read string|null $formatted_published_at
 * @property-read Tag $tag
 *
 * @method static Builder<static>|Post newModelQuery()
 * @method static Builder<static>|Post newQuery()
 * @method static Builder<static>|Post query()
 * @method static Builder<static>|Post whereContent($value)
 * @method static Builder<static>|Post whereCreatedAt($value)
 * @method static Builder<static>|Post whereDescription($value)
 * @method static Builder<static>|Post whereImage($value)
 * @method static Builder<static>|Post wherePublishedAt($value)
 * @method static Builder<static>|Post whereSlug($value)
 * @method static Builder<static>|Post whereTagId($value)
 * @method static Builder<static>|Post whereTitle($value)
 * @method static Builder<static>|Post whereUpdatedAt($value)
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
        'to',
    ];

    public static function schema(Blueprint $table): void
    {
        $table->string('title');
        $table->string('slug');
        $table->text('description');
        $table->text('content');
        $table->string('image');
        $table->date('published_at')->nullable();
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

    public function getKeyName(): string
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
