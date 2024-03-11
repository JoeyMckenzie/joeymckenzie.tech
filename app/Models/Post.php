<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        'keywords' => 'array',
    ];

    /**
     * @return BelongsToMany<Keyword>
     */
    public function keywords(): BelongsToMany
    {
        return $this->belongsToMany(Keyword::class);
    }
}
