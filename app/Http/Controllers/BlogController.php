<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\View\View;

final class BlogController
{
    public function index(): View
    {
        $posts = Post::query() // @phpstan-ignore-line
            ->select(['slug', 'title', 'description', 'published_date'])
            ->orderByDesc('published_date')
            ->get();

        return view('blog', [
            'posts' => $posts,
        ]);
    }

    public function show(string $slug): View
    {
        $post = Post::select([
            'slug',
            'title',
            'description',
            'published_date',
            'parsed_content',
            'hero_image',
        ])->firstWhere('slug', $slug);

        return view('blog-post', [
            'post' => $post,
        ]);
    }
}
