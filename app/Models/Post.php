<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Number;

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
        $formattedViews = Number::format($this->views);

        return new Attribute(
            get: fn (): string => $formattedViews
        );
    }
}
