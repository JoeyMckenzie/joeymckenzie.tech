<?php

declare(strict_types=1);

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $title
 * @property string $description
 * @property string $slug
 * @property Carbon $published_date
 * @property string $hero_image
 * @property string $category
 * @property string $raw_content
 * @property string $parsed_content
 * @property-read string $display_date
 * @property-read Collection<int, Keyword> $keywords
 * @property-read int|null $keywords_count
 *
 * @method static Builder<static>|Post newModelQuery()
 * @method static Builder<static>|Post newQuery()
 * @method static Builder<static>|Post query()
 * @method static Builder<static>|Post whereCategory($value)
 * @method static Builder<static>|Post whereCreatedAt($value)
 * @method static Builder<static>|Post whereDescription($value)
 * @method static Builder<static>|Post whereHeroImage($value)
 * @method static Builder<static>|Post whereId($value)
 * @method static Builder<static>|Post whereParsedContent($value)
 * @method static Builder<static>|Post wherePublishedDate($value)
 * @method static Builder<static>|Post whereRawContent($value)
 * @method static Builder<static>|Post whereSlug($value)
 * @method static Builder<static>|Post whereTitle($value)
 * @method static Builder<static>|Post whereUpdatedAt($value)
 *
 * @mixin Eloquent
 * @mixin IdeHelperPost
 */
final class Post extends Model
{
    protected $casts = [
        'published_date' => 'date:M j, Y',
        'keywords' => 'array',
    ];

    protected $appends = [
        'display_date', // @phpstan-ignore-line
    ];

    /**
     * @return BelongsToMany<Keyword, covariant $this>
     */
    public function keywords(): BelongsToMany
    {
        return $this->belongsToMany(Keyword::class);
    }

    /**
     * @return Attribute<string, string>
     */
    public function displayDate(): Attribute
    {
        /** @var Attribute<string, string> $publishedDate */
        $publishedDate = new Attribute(
            get: fn (): string => $this->published_date->format('M j, Y')
        );

        return $publishedDate;
    }
}
