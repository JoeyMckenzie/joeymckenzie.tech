<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Number;

/**
 * 
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $title
 * @property string $description
 * @property string $slug
 * @property \Illuminate\Support\Carbon $published_date
 * @property string $hero_image
 * @property string $category
 * @property int $views
 * @property string $raw_content
 * @property string $parsed_content
 * @property-read string $display_date
 * @property-read string $formatted_views
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keyword> $keywords
 * @property-read int|null $keywords_count
 * @method static \Illuminate\Database\Eloquent\Builder|Post newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Post newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Post query()
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereHeroImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereParsedContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post wherePublishedDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereRawContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereViews($value)
 * @mixin \Eloquent
 */
final class Post extends Model
{
    protected $fillable = [
        'slug',
        'parsed_content',
        'raw_content',
        'keywords',
        'hero_image',
        'published_date',
        'category',
        'views',
        'description',
        'title',
    ];

    protected $visible = [
        'slug',
        'parsed_content',
        'keywords',
        'hero_image',
        'published_date',
        'category',
        'views',
        'description',
        'title',
    ];

    protected $casts = [
        'published_date' => 'date:M j, Y',
        'keywords' => 'array',
    ];

    protected $appends = [
        'display_date',
        'formatted_views',
    ];

    /**
     * @return BelongsToMany<Keyword>
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
        return new Attribute(
            get: fn (): string => $this->published_date->format('M j, Y')
        );
    }

    /**
     * @return Attribute<string, string>
     */
    public function formattedViews(): Attribute
    {
        /** @var string $formattedViews */
        $formattedViews = $this->views === null
            ? '0'
            : Number::format($this->views);

        return new Attribute(
            get: fn (): string => $formattedViews
        );
    }
}
