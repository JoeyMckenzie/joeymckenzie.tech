<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Support\Facades\Artisan;

Artisan::command('orbit:test', function (): void {
    Post::create([
        'title' => Str::random(10),
        'slug' => Str::slug(Str::random(10)),
        'content' => Str::random(100),
        'image' => Str::random(10),
        'description' => Str::random(100),
        'tag_id' => Tag::firstOrFail()->id,
        'published_at' => Date::now()->format('Y-m-d'),
    ]);
})->purpose('For testing purposes');
