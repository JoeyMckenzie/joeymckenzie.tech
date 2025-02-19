<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\View\View;

final class BlogController
{
    public function index(Request $request): View
    {
        $category = $request->query('category');
        $posts = Post::select([ // @phpstan-ignore-line
            'slug',
            'title',
            'description',
            'category',
            'published_date',
        ])->orderByDesc('published_date');

        if ($category !== null) {
            $posts = $posts->where('category', $category);
        }

        return view('blog', [
            'posts' => $posts->get(),
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

        if ($post === null) {
            abort(404);
        }

        return view('blog-post', [
            'post' => $post,
        ]);
    }
}
