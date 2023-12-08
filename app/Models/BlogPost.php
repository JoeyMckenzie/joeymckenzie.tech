<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = [
        'slug',
        'parsed_content',
        'raw_content',
        'keywords',
        'hero_image',
        'published_date',
        'category',
        'description',
        'title',
        'views',
    ];

    protected $visible = [
        'slug',
        'parsed_content',
        'keywords',
        'hero_image',
        'published_date',
        'category',
        'description',
        'title',
        'views',
    ];

    protected $casts = [
        'published_date' => 'date',
        'keywords' => 'array',
    ];
}
